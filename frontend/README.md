# Darien Coworking Front (Next.js + React)

Frontend para la gestión de reservas del coworking.
Consume la API del backend y muestra listado paginado con opción de eliminar reservas.

Incluye:

- Next.js (SSR/CSR según página)
- Paginación y refresco manual
- Tests mínimos con Jest + React Testing Library
- Dockerfile listo y Compose integrado

**Nota**: El challenge pedía gestión de reservas en el front.
El CRUD de espacios se gestiona vía backend/seeds/API y no se implementa UI de espacios aquí.

## 📦 Estructura del repositorio
/frontend
  /src
    /components
      ReservasList.jsx
      Pagination.jsx
    /lib
      fetcher.js
  Dockerfile
  .env.local
  .env.docker
  /tests
    ReservasList.load.test.jsx
    ReservasList.pagination.test.js
    ReservasList.delete.ok.test.js
    ReservasList.delete.error.test.js
    styleMock.js
  jest.config.js
  jest.setup.js

## ⚙️ Variables de entorno

El front usa estas variables:
```
BACKEND_BASE_URL   # URL base de la API del backend
API_KEY            # API Key requerida por el backend (x-api-key)
BACKEND_API_PREFIX # Prefijo de endpoints (ej: /api)
```

Desarrollo local (sin Docker) → frontend/.env.local:
```
BACKEND_BASE_URL=http://localhost:3001
API_KEY=supersecreta123
BACKEND_API_PREFIX=/api
```

Ejecución con Docker Compose → frontend/.env.docker:
Dentro de Docker, el backend se resuelve por nombre de servicio: "back"
```
BACKEND_BASE_URL=http://back:3001
API_KEY=supersecreta123
BACKEND_API_PREFIX=/api
```

Asegúrate de que docker-compose.yml tenga en front:
```
env_file:
  - ./frontend/.env.docker
```

## 🏃 Ejecutar
1) Local (sin Docker)

Requiere tener el backend corriendo (puerto 3001):
```
cd frontend
npm i
npm run dev
```

Abrir: http://localhost:3000

2) Con Docker (stack completo)

Desde la raíz del repo (donde está docker-compose.yml):
```
docker compose up -d --build
```

Front: http://localhost:3000

Back: http://localhost:3001

## 🧪 Testing (pack mínimo)

Se incluyó un set de 4 tests enfocados en el flujo principal de reservas:

Carga inicial: renderiza 3 items y muestra paginación.

Paginación: click en “Siguiente” → solicita page=2 y re-renderiza.

Eliminar (OK): confirm = true → DELETE y re-fetch de página actual.

Eliminar (error): si DELETE falla, la lista no cambia y se informa error.

Los tests mockean apiFetch para mantener el front liviano y sin dependencias de red durante el challenge.

Comandos:
```
npm run test        # Ejecuta los tests
npm run test:watch  # Watch mode
npm run test:cov    # Cobertura
```

## 🔌 Integración con la API

Todas las requests front→back envían x-api-key: <API_KEY>.

Las rutas se construyen con:
```
BACKEND_BASE_URL (host del backend)
BACKEND_API_PREFIX (ej: /api)
```

En Docker, el host del backend es http://back:3001 (nombre del servicio en Compose).
No usar localhost desde dentro del contenedor del front.

### 🛠 Decisiones de diseño

- Simplicidad: el front se centra en listar/operar reservas (requerimiento del challenge).

- Responsabilidad clara: los espacios se administran en backend (migraciones/seeds/API).

- Testing pragmático: se testea el flujo crítico con mocks de apiFetch, evitando sobrecarga (MSW, polyfills, etc.) para un reto corto.

- Docker: imagen de Next.js en modo standalone; el front usa envs distintos para local vs Docker.
