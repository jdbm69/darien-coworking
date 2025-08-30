// src/utils/validators.js
// Helpers de validación genéricos

// Helper para validar numeros 
function parseIntOrNull(v) {
  const n = parseInt(v, 10);
  return Number.isNaN(n) ? null : n;
}

// Helper para validar formato básico de email
function isEmail(s) {
  return typeof s === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

// Helper para validar formato de HH:mm
function isHHmm(s) {
  if (typeof s !== 'string') return false;
  const m = s.match(/^(\d{2}):(\d{2})$/);
  if (!m) return false;
  const h = Number(m[1]), mm = Number(m[2]);
  return h >= 0 && h <= 23 && mm >= 0 && mm <= 59;
}

module.exports = { parseIntOrNull, isEmail, isHHmm };