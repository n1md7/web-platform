'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('files', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      ownerId: {
        type: Sequelize.INTEGER(11),
        allowNull: false
      },
      owner: {
        type: Sequelize.STRING(8),
        allowNull: false
      },
      originalName: {
        type: Sequelize.STRING(512),
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(512),
        allowNull: false
      },
      extension: {
        type: Sequelize.STRING(32),
        allowNull: false
      },
      mime: {
        type: Sequelize.STRING(128),
        allowNull: false
      },
      status: {
        type: Sequelize.STRING(64),
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    }, {
      charset: 'utf8',
      collate: 'utf8_general_ci'
    });

    await queryInterface.addIndex('files', ['ownerId']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('files');
  }
};
