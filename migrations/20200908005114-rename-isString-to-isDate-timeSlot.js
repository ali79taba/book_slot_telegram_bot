'use strict';

module.exports = {
  up:async (queryInterface, Sequelize) => {
    return Promise.all([
      await queryInterface.renameColumn('timeSlots', 'isString', 'isDate'),
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
