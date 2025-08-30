# Darien Coworking API (Node.js + Express + Sequelize + Postgres + Docker)

Backend para gestión de **espacios** y **reservas** de coworking. 

Incluye:
- Autenticación por **API Key** (header `x-api-key`)
- **Sequelize** + **PostgreSQL** con migraciones
- Reglas de negocio: **sin solapamientos** y **máx. 3 reservas/semana por cliente**
- Tests **unitarios**, **integración** y **E2E**
- **Docker Compose** (db + backend)

## 📦 Estructura del repositorio
```
/backend
  /src
/controllers
/middlewares
/routes
/utils
app.js
server.js
/models
/migrations
/config/config.js
Dockerfile
.env.docker
docker-compose.yml
```

## 🚀 Despliegue 

### 1. *Pre-requisitos*
- Docker + Docker Compose
- Node 18+ (solo si deseas correr localmente)

### 2. *Variables de entorno (backend)*
- En Docker ya están definidas en `backend/.env.docker`:
```
PORT=3001
API_KEY=supersecreta123

DB_DIALECT=postgres
DB_HOST=db
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=coworking_db
NODE_ENV=production
```

### 3. Para correr **local** (sin Docker)
- Usa `backend/.env` con `DB_HOST=127.0.0.1` y `DB_PORT=5433` (puerto publicado por el contenedor de Postgres).

- Ejecutar: 
```
cd backend
npm i
npx sequelize-cli db:migrate --url "postgres://postgres:postgres@127.0.0.1:5433/coworking_db"
npm run dev
```

### 4. Para levantar en Docker
```
docker compose up -d --build
```

### 5. Healthcheck
```
GET http://localhost:3001/health → { ok: true, ... }
```

## 📡 Endpoints (prefijo /api)

- Todos requieren header x-api-key: <API_KEY>.

### Espacios

- POST /api/espacios
Body: { nombre, ubicacion, capacidad, descripcion? }

- GET /api/espacios

- GET /api/espacios/:id

- PUT /api/espacios/:id

- DELETE /api/espacios/:id

### Reservas

- POST /api/reservas
Body: { espacioId, emailCliente, fecha(YYYY-MM-DD), horaInicio(HH:mm), horaFin(HH:mm) }
Reglas: sin solapamientos + máx. 3/semana por email.

- GET /api/reservas?page=1&pageSize=10&fecha=YYYY-MM-DD&espacioId=1&email=foo@bar.com

- GET /api/reservas/:id

- PUT /api/reservas/:id

- DELETE /api/reservas/:id

### Códigos de error relevantes:

- 401 sin API Key

- 400 validaciones

- 409 conflicto de horario

- 429 límite semanal superado

## 📄 Migraciones / Seeds

- En Docker, el contenedor del backend corre db:migrate al iniciar.
Para correr manualmente desde backend/:
```
npx sequelize-cli db:migrate --url "postgres://postgres:postgres@127.0.0.1:5433/coworking_db"
```

## 🧪 Testing

### Unit & Integration
```
cd backend
npm i
npm test
```
### End-to-End (E2E)
Con el stack dockerizado arriba:
```
cd backend
npm run test:e2e
```
-Los E2E prueban: crear espacio → crear reserva → detectar solape → borrar espacio y verificar CASCADE borra reservas.

## 🛠 Decisiones de diseño

- Sequelize con config.js para leer .env (evita credenciales hardcodeadas).

- Validaciones y reglas encapsuladas en helpers (src/utils) para mantener controladores limpios.

- Horas en formato HH:mm (string) y comparación por minutos para simplicidad.

- Índices en Reservas para consultas comunes por espacioId+fecha y emailCliente+fecha.

- API Key simple para el challenge; fácilmente reemplazable por JWT.
