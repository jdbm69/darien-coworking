// tests/integration/app.test.js
// Tests de integración básicos: espacios y reservas.

const request = require('supertest');
const app = require('../../src/app');
const { sequelize } = require('../../models');

const API_KEY = process.env.API_KEY || 'supersecreta123';

// Recreacion de tablas vacias
beforeAll(async () => {
  await sequelize.sync({ force: true });
});

// Cierre de conexion
afterAll(async () => {
  await sequelize.close();
});

// Tests
describe('API Integration', () => {
  let espacioId;

  // 1. Test de creacion de un espacio
  test('POST /api/espacios crea un espacio', async () => {
    const res = await request(app)
      .post('/api/espacios')
      .set('x-api-key', API_KEY)
      .send({
        nombre: 'Sala Atlántico',
        ubicacion: 'Piso 2',
        capacidad: 8,
        descripcion: 'Sala con TV'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.nombre).toBe('Sala Atlántico');
    espacioId = res.body.id;
  });

  // 2. Test de Listar los espacios
  test('GET /api/espacios lista espacios', async () => {
    const res = await request(app)
      .get('/api/espacios')
      .set('x-api-key', API_KEY);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  // 3. Test de creacion de reserva valida
  test('POST /api/reservas crea una reserva válida', async () => {
    const res = await request(app)
      .post('/api/reservas')
      .set('x-api-key', API_KEY)
      .send({
        espacioId,
        emailCliente: 'ana@example.com',
        fecha: '2025-09-01',
        horaInicio: '10:00',
        horaFin: '11:00'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.espacioId).toBe(espacioId);
  });

  // 4. Test para detectar solapamiento entre fechas
  test('POST /api/reservas detecta solapamiento', async () => {
    const res = await request(app)
      .post('/api/reservas')
      .set('x-api-key', API_KEY)
      .send({
        espacioId,
        emailCliente: 'pepe@example.com',
        fecha: '2025-09-01',
        horaInicio: '10:30',
        horaFin: '11:30'
      });
    expect(res.statusCode).toBe(409);
  });

  // 5. Test para limite de 3 reservas por semana para una persona
  test('POST /api/reservas aplica límite semanal (4ta => 429)', async () => {
    const email = 'lola@example.com';
    const fecha = '2025-09-02'; // misma semana que el resto
    const mk = (horaInicio, horaFin) =>
      request(app)
        .post('/api/reservas')
        .set('x-api-key', API_KEY)
        .send({
          espacioId,
          emailCliente: email,
          fecha,
          horaInicio,
          horaFin
        });

    // 1ra, 2da y 3ra reservas de la semana (todas 201)
    const r1 = await mk('09:00', '10:00');
    expect(r1.statusCode).toBe(201);

    const r2 = await mk('11:00', '12:00');
    expect(r2.statusCode).toBe(201);

    const r3 = await mk('12:30', '13:30');
    expect(r3.statusCode).toBe(201);

    // 4ta reserva en la misma semana ⇒ 429 (límite superado)
    const r4 = await mk('14:00', '15:00');
    expect(r4.statusCode).toBe(429);
  });
});