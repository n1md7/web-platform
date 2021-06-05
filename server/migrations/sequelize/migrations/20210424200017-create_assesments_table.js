'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('assessments', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      templateId: {
        type: Sequelize.INTEGER(11),
        allowNull: false
      },
      createdBy: {
        type: Sequelize.INTEGER(11),
        allowNull: false
      },
      organisationId: {
        type: Sequelize.INTEGER(11),
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(512),
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

    await queryInterface.addIndex('assessments', ['templateId', 'userId']);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('assessments');
     */
    await queryInterface.dropTable('assessments');
  }
};
