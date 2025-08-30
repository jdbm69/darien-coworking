// src/utils/time.js
// Helpers de tiempo para validaciones de reservas

// Helper para convertir a minutos
function toMinutes(hhmm) {
  if (typeof hhmm !== 'string') return NaN;
  const m = hhmm.match(/^(\d{2}):(\d{2})$/);
  if (!m) return NaN;
  const [, hh, mm] = m;
  const h = Number(hh), m2 = Number(mm);
  if (h > 23 || m2 > 59) return NaN;
  return h * 60 + m2;
}

// Helper para ver si dos intervalos de tiempo se solapan
function overlaps(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && bStart < aEnd;
}

// Helper para devolver lunes...domingo de la semana
function weekRangeYYYYMMDD(isoDateStr) {
  const d = new Date(isoDateStr + 'T00:00:00Z');
  const dow = (d.getUTCDay() + 6) % 7; // 0=lunes
  const monday = new Date(d);
  monday.setUTCDate(d.getUTCDate() - dow);
  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);
  const fmt = (dt) => dt.toISOString().slice(0, 10);
  return { start: fmt(monday), end: fmt(sunday) };
}

module.exports = { toMinutes, overlaps, weekRangeYYYYMMDD };