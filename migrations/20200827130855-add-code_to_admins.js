'use strict';

module.exports = {
  up:async (queryInterface, Sequelize) => {
    return Promise.all([
      await queryInterface.addColumn(
          'admins',
          'code', {
            type: Sequelize.DataTypes.STRING
          }
      )
    ])
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
