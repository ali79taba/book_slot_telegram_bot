'use strict';

module.exports = {
  up:async (queryInterface, Sequelize) => {
    return Promise.all([
      await queryInterface.addColumn(
          'timeSlots',
          'isString', {
            type: Sequelize.DataTypes.BOOLEAN
          }
      ),
      await queryInterface.addColumn(
          'timeSlots',
          'startDate', {
            type: Sequelize.DataTypes.INTEGER
          }
      ),
      await queryInterface.addColumn(
          'timeSlots',
          'endDate', {
            type: Sequelize.DataTypes.INTEGER
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
