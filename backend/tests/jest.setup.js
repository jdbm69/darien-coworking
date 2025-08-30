// tests/jest.setup.js
// Setup que carga las variables de entorno para testing

process.env.NODE_ENV = 'test';
process.env.API_KEY = process.env.API_KEY || 'supersecreta123';

process.env.DB_DIALECT = 'postgres';
process.env.DB_HOST = process.env.DB_HOST || '127.0.0.1';
process.env.DB_PORT = process.env.DB_PORT || '5433';
process.env.DB_USER = process.env.DB_USER || 'postgres';
process.env.DB_PASS = process.env.DB_PASS || 'postgres';
process.env.DB_NAME = process.env.DB_NAME || 'coworking_db_test';