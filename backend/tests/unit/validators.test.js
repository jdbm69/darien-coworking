// tests/unit/validators.test.js
// Tests unitarios para helpers de validadores

const { isEmail, isHHmm, parseIntOrNull } = require('../../src/utils/validators');

describe('validators utils', () => {
  test('isEmail', () => {
    expect(isEmail('ana@example.com')).toBe(true);
    expect(isEmail('mal')).toBe(false);
  });
  test('isHHmm', () => {
    expect(isHHmm('09:30')).toBe(true);
    expect(isHHmm('9:30')).toBe(false);
    expect(isHHmm('24:00')).toBe(false);
    expect(isHHmm('10:60')).toBe(false);
  });
  test('parseIntOrNull', () => {
    expect(parseIntOrNull('42')).toBe(42);
    expect(parseIntOrNull('abc')).toBeNull();
  });
});