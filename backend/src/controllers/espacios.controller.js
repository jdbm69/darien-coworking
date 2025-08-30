// src/controllers/espacios.controller.js
// Controlador CRUD para "Espacios": create, list, getById, update, delete

const { Espacio } = require('../../models');
const { parseIntOrNull } = require('../utils');

// Creacion del espacio
exports.create = async (req, res) => {
  try {
    const { nombre, ubicacion, capacidad, descripcion } = req.body;
    if (!nombre || !ubicacion || parseIntOrNull(capacidad) === null) {
      return res.status(400).json({ error: 'nombre, ubicacion y capacidad son requeridos' });
    }
    const espacio = await Espacio.create({ nombre, ubicacion, capacidad, descripcion });
    return res.status(201).json(espacio);
  } catch (err) {
    return res.status(500).json({ error: 'Error creando espacio', details: err.message });
  }
};

// Lista de espacios
exports.list = async (_req, res) => {
  try {
    const espacios = await Espacio.findAll({ order: [['id', 'ASC']] });
    return res.json(espacios);
  } catch (err) {
    return res.status(500).json({ error: 'Error listando espacios', details: err.message });
  }
};

// Espacio en especifico
exports.getById = async (req, res) => {
  try {
    const id = parseIntOrNull(req.params.id);
    if (!id) return res.status(400).json({ error: 'id inválido' });

    const espacio = await Espacio.findByPk(id);
    if (!espacio) return res.status(404).json({ error: 'Espacio no encontrado' });
    return res.json(espacio);
  } catch (err) {
    return res.status(500).json({ error: 'Error obteniendo espacio', details: err.message });
  }
};

// Edicion de espacio
exports.update = async (req, res) => {
  try {
    const id = parseIntOrNull(req.params.id);
    if (!id) return res.status(400).json({ error: 'id inválido' });

    const { nombre, ubicacion, capacidad, descripcion } = req.body;
    const espacio = await Espacio.findByPk(id);
    if (!espacio) return res.status(404).json({ error: 'Espacio no encontrado' });

    await espacio.update({ nombre, ubicacion, capacidad, descripcion });
    return res.json(espacio);
  } catch (err) {
    return res.status(500).json({ error: 'Error actualizando espacio', details: err.message });
  }
};

// Eliminar espacio
exports.remove = async (req, res) => {
  try {
    const id = parseIntOrNull(req.params.id);
    if (!id) return res.status(400).json({ error: 'id inválido' });

    const espacio = await Espacio.findByPk(id);
    if (!espacio) return res.status(404).json({ error: 'Espacio no encontrado' });

    await espacio.destroy();
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ error: 'Error eliminando espacio', details: err.message });
  }
};