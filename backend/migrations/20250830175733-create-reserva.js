// migrations/XXXX-create-reserva.js
// Crea la tabla "Reservas" con FK a "Espacios" e índices útiles

'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Reservas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      espacioId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Espacios', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      emailCliente: {
        type: Sequelize.STRING,
        allowNull: false
      },
      fecha: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      horaInicio: {
        type: Sequelize.STRING(5),
        allowNull: false
      },
      horaFin: {
        type: Sequelize.STRING(5),
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });

    await queryInterface.addIndex('Reservas', ['espacioId', 'fecha']);
    await queryInterface.addIndex('Reservas', ['emailCliente', 'fecha']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Reservas');
  }
};