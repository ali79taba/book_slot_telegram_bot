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
    	await queryInterface.addColumn(
	  'admins',
	  'username',{
                type: Sequelize.DataTypes.STRING
            }
	)
  ])
  },

};
