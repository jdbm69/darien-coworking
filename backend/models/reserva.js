// models/reserva.js
// Modelo Sequelize de "Reserva". Representa reservas sobre un espacio en una fecha y rango horario

'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Reserva extends Model {
    static associate(models) {
      // Una reserva pertenece a un Espacio
      Reserva.belongsTo(models.Espacio, {
        foreignKey: 'espacioId',
        as: 'espacio',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }
  Reserva.init(
    {
      espacioId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      emailCliente: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { isEmail: true }
      },
      fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      horaInicio: {
        type: DataTypes.STRING(5),
        allowNull: false,
        validate: { is: /^\d{2}:\d{2}$/ }
      },
      horaFin: {
        type: DataTypes.STRING(5),
        allowNull: false,
        validate: { is: /^\d{2}:\d{2}$/ }
      }
    },
    {
      sequelize,
      modelName: 'Reserva',
      tableName: 'Reservas'
    }
  );
  return Reserva;
};