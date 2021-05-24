'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('userInfo', {
      userId: {
        primaryKey: true,
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: false
      },
      firstName: Sequelize.STRING(32),
      middleName: Sequelize.STRING(32),
      lastName: Sequelize.STRING(32),
      organisationId: Sequelize.INTEGER(11),
      dateOfBirth: Sequelize.DATE,
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

    await queryInterface.addIndex('userInfo', ['userId']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('userInfo');
  }
};
