# Darien Coworking – (Next.js/Express.js)

Stack completo para gestión de reservas de un coworking.

- Backend: Node.js + Express + Sequelize + PostgreSQL

- Frontend: Next.js + Sass (lista/gestiona reservas)

- DB: Postgres 16

- Orquestación: Docker Compose

**Nota importante**: La creación/edición de espacios no tiene UI en el front. Para probar reservas, primero crea espacios usando Postman/cURL contra la API.

## 🚀 Arranque rápido con Docker Compose

Requisitos: Docker y Docker Compose instalados.

1. Clonar el repo 
```
git clone <repo-url>
cd <repo>
```
2. Levantar todo
```
docker compose up -d --build
```
3. Accesos

- Frontend: http://localhost:3000

- Backend: http://localhost:3001

- DB: localhost:5433 (usuario: postgres, pass: postgres, db: coworking_db)

El backend requiere header x-api-key: supersecreta123 en todas las requests.

## ⚙️ Variables de entorno (ya listas para Docker)

Backend: backend/.env.docker

Frontend: frontend/.env.docker (el front usa http://back:3001 para hablar con la API dentro de Docker)

## 🧪 Flujo mínimo para probar (Postman/cURL)

1. Crear un espacio (necesario previo a reservar):
```
curl -X POST http://localhost:3001/api/espacios \
  -H "Content-Type: application/json" \
  -H "x-api-key: supersecreta123" \
  -d '{"nombre":"Sala Norte","ubicacion":"Piso 1","capacidad":8,"descripcion":"TV + pizarrón"}'
```
2. Usar el Fontend para, ver espacio, crear reserva, ver reservas, eliminar reservas.