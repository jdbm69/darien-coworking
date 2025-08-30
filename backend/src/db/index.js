// src/db/index.js
// Inicializa y exporta la instancia de Sequelize leyendo credenciales desde .env. Verifica conexión al arrancar

require('dotenv').config();
const { Sequelize } = require('sequelize');

// Comunicacion con la base de datos
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5433,
    dialect: process.env.DB_DIALECT || 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
  }
);

// Funcion async para ver que se conecta correctamente
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log(`✅ Conectado a la DB "${process.env.DB_NAME}"`);
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error.message);
  }
}

module.exports = { sequelize, testConnection };