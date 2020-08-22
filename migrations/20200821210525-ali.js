'use strict';

module.exports = {
  up:async (queryInterface, Sequelize) => {
  return Promise.all([
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    	await migration.addColumn(
	  'admins',
	  'username',
	  DataTypes.STRING
	)
  ])
  },

};
