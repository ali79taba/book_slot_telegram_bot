'use strict';

module.exports = {
  up:async (queryInterface, Sequelize) => {
    return Promise.all([
      await queryInterface.addColumn(
          'teachers',
          'dontSendRequestNotificationBot', {
            type: Sequelize.DataTypes.BOOLEAN,
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
