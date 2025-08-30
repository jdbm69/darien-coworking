// jest.config.js
// Configuracion basica de Jest para tests unitarios e integración

module.exports = {
  testEnvironment: 'node',
  verbose: true,
  roots: ['<rootDir>/tests'],
  setupFiles: ['<rootDir>/tests/jest.setup.js'],
  testTimeout: 30000
};