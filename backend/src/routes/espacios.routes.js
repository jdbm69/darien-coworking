// src/routes/espacios.routes.js
// Rutas CRUD para "Espacios". Requieren API Key

const { Router } = require('express');
const ctrl = require('../controllers/espacios.controller');

const route = Router();
route.post('/', ctrl.create);
route.get('/', ctrl.list);
route.get('/:id', ctrl.getById);
route.put('/:id', ctrl.update);
route.delete('/:id', ctrl.remove);

module.exports = route;