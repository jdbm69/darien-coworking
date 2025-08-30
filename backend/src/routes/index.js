// src/routes/index.js
// Router principal protegido por API Key. Aquí se montan los endpoints de espacios y reservas

const { Router } = require('express');
const apiKeyAuth = require('../middlewares/auth');
const espaciosRoutes = require('./espacios.routes');
const reservasRoutes = require('./reservas.routes');

const router = Router();

// Todo lo que cuelga de /api requiere API key
router.use(apiKeyAuth);

// Rutas de los espacios
router.use('/espacios', espaciosRoutes);

// Rutas de las reservas
router.use('/reservas', reservasRoutes);

module.exports = router;