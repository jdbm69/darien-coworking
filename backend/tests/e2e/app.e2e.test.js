// tests/e2e/app.e2e.test.js
// Prueba E2E real contra el backend dockerizado (http://localhost:3001)
// Flujo: crear espacio -> crear reserva -> listar -> borrar espacio (CASCADE) -> verificar que desapareció la reserva

const axios = require('axios');

const BASE = 'http://localhost:3001';
const API = `${BASE}/api`;
const API_KEY = 'supersecreta123';

const client = axios.create({
  baseURL: API,
  headers: { 'x-api-key': API_KEY },
  validateStatus: () => true 
});

// Mini helper para esperar a que /health esté OK (cuando el contenedor recién arranca)
async function waitForHealth(maxMs = 15000) {
  const start = Date.now();
  // intentos cada 500ms
  while (Date.now() - start < maxMs) {
    try {
      const res = await axios.get(`${BASE}/health`);
      if (res.status === 200 && res.data && res.data.ok) return;
    } catch (_) { /* ignorar hasta que levante */ }
    await new Promise(r => setTimeout(r, 500));
  }
  throw new Error('Healthcheck no respondió OK a tiempo');
}

// Tests
describe('E2E Flow', () => {
  let espacioId, reservaId;

  beforeAll(async () => {
    await waitForHealth();
  });

  // 1. Test de rechazo sin API KEY obligatoria
  test('rechaza sin API Key (401)', async () => {
    const res = await axios.post(`${API}/espacios`, { nombre:'X', ubicacion:'Y', capacidad:1 }, { validateStatus:()=>true });
    expect(res.status).toBe(401);
  });

  // 2. Test de creacion de espacio
  test('crear espacio (201)', async () => {
    const res = await client.post('/espacios', {
      nombre: 'Sala E2E',
      ubicacion: 'Piso 3',
      capacidad: 4,
      descripcion: 'TV'
    });
    expect(res.status).toBe(201);
    expect(res.data).toHaveProperty('id');
    espacioId = res.data.id;
  });

  // 3. Test para ver la lista de espacios
  test('listar espacios (200)', async () => {
    const res = await client.get('/espacios');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);
    expect(res.data.some(e => e.id === espacioId)).toBe(true);
  });

  // 4. Test de creacion de reserva
  test('crear reserva válida (201)', async () => {
    const res = await client.post('/reservas', {
      espacioId,
      emailCliente: 'e2e@test.com',
      fecha: '2025-09-10',
      horaInicio: '10:00',
      horaFin: '11:00'
    });
    expect(res.status).toBe(201);
    reservaId = res.data.id;
  });

  // 5. Test de intentar reservar en mismas fechas (solapamiento)
  test('intento de solapamiento (409)', async () => {
    const res = await client.post('/reservas', {
      espacioId,
      emailCliente: 'otro@test.com',
      fecha: '2025-09-10',
      horaInicio: '10:30',
      horaFin: '11:30'
    });
    expect(res.status).toBe(409);
  });

  // 6. Test para borrar un espacio y reserva
  test('borrar espacio (204) y CASCADE borra reserva', async () => {
    const del = await client.delete(`/espacios/${espacioId}`);
    expect(del.status).toBe(204);

    const list = await client.get('/reservas');

    const data = Array.isArray(list.data) ? list.data : list.data.data;
    expect(Array.isArray(data)).toBe(true);
    expect(data.some(r => r.id === reservaId)).toBe(false);
  });
});