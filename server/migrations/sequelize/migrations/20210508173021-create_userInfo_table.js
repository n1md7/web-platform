'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('userInfo', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: Sequelize.INTEGER(11),
        allowNull: false
      },
      firstName: Sequelize.STRING(32),
      middleName: Sequelize.STRING(32),
      lastName: Sequelize.STRING(32),
      organization: Sequelize.STRING(128),
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
