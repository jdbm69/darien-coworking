// models/espacio.js
// Modelo Sequelize de "Espacio". Representa un espacio de coworking con nombre, ubicación, capacidad y descripcion opcional

'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Espacio extends Model {
    static associate(models) {
      this.hasMany(models.Reserva, {
          foreignKey: 'espacioId',
          as: 'reservas',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
      });
    }
  }
  Espacio.init(
    {
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true, len: [2, 120] }
      },
      ubicacion: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true, len: [2, 200] }
      },
      capacidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, isInt: true }
      },
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'Espacio',
      tableName: 'Espacios',
      underscored: false
    }
  );
  return Espacio;
};