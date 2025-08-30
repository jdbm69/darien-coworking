// src/routes/reservas.routes.js
// Rutas CRUD para "Reservas" con paginación en GET / (page, pageSize).

const { Router } = require('express');
const ctrl = require('../controllers/reservas.controller');

const route = Router();
route.post('/', ctrl.create);
route.get('/', ctrl.list);
route.get('/:id', ctrl.getById);
route.put('/:id', ctrl.update);
route.delete('/:id', ctrl.remove);

module.exports = route;