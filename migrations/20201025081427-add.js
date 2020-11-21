'use strict';

module.exports = {
  up:async (queryInterface, Sequelize) => {
    return Promise.all([
      await queryInterface.addColumn(
          'users',
          'reasonQuestion', {
            type: Sequelize.DataTypes.TEXT,
            allowNull: true
          }
      ),
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
