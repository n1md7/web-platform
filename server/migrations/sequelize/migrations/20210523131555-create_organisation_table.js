'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('organisation', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      name: Sequelize.STRING(128),
      website: Sequelize.STRING(256),
      entityType: Sequelize.STRING(64),
      industryId: Sequelize.INTEGER(11),
      registeredNumber: Sequelize.INTEGER(64),
      street: Sequelize.STRING(128),
      cityOrTown: Sequelize.STRING(128),
      countryOrState: Sequelize.STRING(128),
      postCode: Sequelize.STRING(128),
      country: Sequelize.STRING(128),
      size: Sequelize.STRING(64),
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
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('organisation');
  }
};
