// src/controllers/reservas.controller.js
// Controlador CRUD para "Reservas" con validaciones

const { Op } = require('sequelize');
const { Reserva, Espacio } = require('../../models');
const { toMinutes, overlaps, weekRangeYYYYMMDD, isEmail, isHHmm } = require('../utils');

// Creacion de la reserva
exports.create = async (req, res) => {
  try {
    const { espacioId, emailCliente, fecha, horaInicio, horaFin } = req.body;

    if (!espacioId || !emailCliente || !fecha || !horaInicio || !horaFin) {
    return res.status(400).json({ error: 'espacioId, emailCliente, fecha, horaInicio y horaFin son requeridos' });
    }
    if (!isEmail(emailCliente)) return res.status(400).json({ error: 'emailCliente inválido' });
    if (!isHHmm(horaInicio) || !isHHmm(horaFin)) return res.status(400).json({ error: 'horaInicio/horaFin deben ser HH:mm' });

    const start = toMinutes(horaInicio);
    const end = toMinutes(horaFin);
    if (start >= end) return res.status(400).json({ error: 'horaInicio debe ser menor que horaFin' });

    // 1) Regla: no solapar reservas en mismo espacio y fecha
    const mismas = await Reserva.findAll({
      where: { espacioId, fecha },
      attributes: ['horaInicio', 'horaFin']
    });

    const hayConflicto = mismas.some(r => {
      const s = toMinutes(r.horaInicio);
      const e = toMinutes(r.horaFin);
      return overlaps(start, end, s, e);
    });

    if (hayConflicto) {
      return res.status(409).json({ error: 'Conflicto de horario para este espacio y fecha' });
    }

    // 2) Regla: máximo 3 reservas por semana por email
    const { start: weekStart, end: weekEnd } = weekRangeYYYYMMDD(fecha);
    const countSemana = await Reserva.count({
      where: {
        emailCliente,
        fecha: { [Op.between]: [weekStart, weekEnd] }
      }
    });
    if (countSemana >= 3) {
      return res.status(429).json({ error: 'Límite semanal alcanzado (máximo 3 reservas por semana por cliente)' });
    }

    // Crear
    const reserva = await Reserva.create({ espacioId, emailCliente, fecha, horaInicio, horaFin });
    return res.status(201).json(reserva);
  } catch (err) {
    return res.status(500).json({ error: 'Error creando reserva', details: err.message });
  }
};

// Lista de reservas
exports.list = async (req, res) => {
  try {
    // Paginación ?page=1&pageSize=10
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const pageSize = Math.min(Math.max(parseInt(req.query.pageSize || '10', 10), 1), 100);
    const offset = (page - 1) * pageSize;
    const limit = pageSize;

    const where = {};
    if (req.query.fecha) where.fecha = req.query.fecha;
    if (req.query.espacioId) where.espacioId = Number(req.query.espacioId);
    if (req.query.email) where.emailCliente = req.query.email;

    const { rows, count } = await Reserva.findAndCountAll({
      where,
      include: [{ model: Espacio, as: 'espacio', attributes: ['id', 'nombre', 'ubicacion', 'capacidad'] }],
      order: [['fecha', 'ASC'], ['horaInicio', 'ASC']],
      limit,
      offset
    });

    return res.json({
      data: rows,
      meta: {
        page,
        pageSize,
        total: count,
        totalPages: Math.ceil(count / pageSize)
      }
    });
  } catch (err) {
    return res.status(500).json({ error: 'Error listando reservas', details: err.message });
  }
};

// Reserva en especifico
exports.getById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'id inválido' });

    const reserva = await Reserva.findByPk(id, {
      include: [{ model: Espacio, as: 'espacio', attributes: ['id', 'nombre', 'ubicacion', 'capacidad'] }]
    });
    if (!reserva) return res.status(404).json({ error: 'Reserva no encontrada' });

    return res.json(reserva);
  } catch (err) {
    return res.status(500).json({ error: 'Error obteniendo reserva', details: err.message });
  }
};

// Modificar reserva
exports.update = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'id inválido' });

    const reserva = await Reserva.findByPk(id);
    if (!reserva) return res.status(404).json({ error: 'Reserva no encontrada' });

    const payload = {
      espacioId: req.body.espacioId ?? reserva.espacioId,
      emailCliente: req.body.emailCliente ?? reserva.emailCliente,
      fecha: req.body.fecha ?? reserva.fecha,
      horaInicio: req.body.horaInicio ?? reserva.horaInicio,
      horaFin: req.body.horaFin ?? reserva.horaFin
    };

    // Validaciones
    if (!isEmail(payload.emailCliente)) {
      return res.status(400).json({ error: 'emailCliente inválido' });
    }
    if (!isHHmm(payload.horaInicio) || !isHHmm(payload.horaFin)) {
      return res.status(400).json({ error: 'horaInicio/horaFin deben ser HH:mm' });
    }

    const start = toMinutes(payload.horaInicio);
    const end = toMinutes(payload.horaFin);
    if (start >= end) {
      return res.status(400).json({ error: 'horaInicio debe ser menor que horaFin' });
    }

    // Conflictos (excluyendo la propia reserva)
    const mismas = await Reserva.findAll({
      where: {
        id: { [Op.ne]: id },
        espacioId: payload.espacioId,
        fecha: payload.fecha
      },
      attributes: ['horaInicio', 'horaFin']
    });
    const hayConflicto = mismas.some(r => overlaps(start, end, toMinutes(r.horaInicio), toMinutes(r.horaFin)));
    if (hayConflicto) {
      return res.status(409).json({ error: 'Conflicto de horario para este espacio y fecha' });
    }

    // Límite por semana
    const { start: weekStart, end: weekEnd } = weekRangeYYYYMMDD(payload.fecha);
    const countSemana = await Reserva.count({
      where: {
        id: { [Op.ne]: id },
        emailCliente: payload.emailCliente,
        fecha: { [Op.between]: [weekStart, weekEnd] }
      }
    });
    if (countSemana >= 3) {
      return res.status(429).json({ error: 'Límite semanal alcanzado (máximo 3 reservas por semana por cliente)' });
    }

    await reserva.update(payload);
    return res.json(reserva);
  } catch (err) {
    return res.status(500).json({ error: 'Error actualizando reserva', details: err.message });
  }
};

// Eliminar reserva
exports.remove = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'id inválido' });

    const reserva = await Reserva.findByPk(id);
    if (!reserva) return res.status(404).json({ error: 'Reserva no encontrada' });

    await reserva.destroy();
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ error: 'Error eliminando reserva', details: err.message });
  }
};