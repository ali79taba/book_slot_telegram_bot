'use strict';

module.exports = {
  up:async (queryInterface, Sequelize) => {
    return Promise.all([
      await queryInterface.changeColumn(
          'timeSlots',
          'description', {
            type: Sequelize.DataTypes.STRING,
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
