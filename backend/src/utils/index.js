// src/utils/index.js
// Punto único de export de utils

const time = require('./time');
const validators = require('./validators');

module.exports = { ...time, ...validators };