// tests/unit/time.test.js
// Tests unitarios para helpers de tiempo

const { toMinutes, overlaps, weekRangeYYYYMMDD } = require('../../src/utils/time');

describe('time utils', () => {
  test('toMinutes convierte HH:mm a minutos', () => {
    expect(toMinutes('00:00')).toBe(0);
    expect(toMinutes('10:30')).toBe(630);
    expect(toMinutes('23:59')).toBe(23 * 60 + 59);
  });

  test('toMinutes invalida formatos incorrectos', () => {
    expect(Number.isNaN(toMinutes('24:00'))).toBe(true);
    expect(Number.isNaN(toMinutes('09:60'))).toBe(true);
    expect(Number.isNaN(toMinutes('9:00'))).toBe(true);
    expect(Number.isNaN(toMinutes('hola'))).toBe(true);
    expect(Number.isNaN(toMinutes(null))).toBe(true);
  });

  test('overlaps detecta solapamientos', () => {
    expect(overlaps(600, 660, 630, 645)).toBe(true);
    expect(overlaps(600, 660, 660, 720)).toBe(false);
  });

  test('weekRangeYYYYMMDD retorna lunes..domingo', () => {
    const r = weekRangeYYYYMMDD('2025-09-03');
    expect(r).toHaveProperty('start');
    expect(r).toHaveProperty('end');
    expect(r.start).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(r.end).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});