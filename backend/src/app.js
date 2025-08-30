// src/app.js
// Configuración principal de la aplicación Express: middlewares globales, healthcheck y rutas protegidas

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const routes = require('./routes');

const app = express();
app.use(cors());
app.use(express.json());

// Morgan para ver en consola, util en desarrollo para debuggear
app.use(morgan('dev'));

// Healthcheck público (para probar rápido)
app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'coworking-api', ts: new Date().toISOString() });
});

// Rutas protegidas
app.use('/api', routes);

module.exports = app;