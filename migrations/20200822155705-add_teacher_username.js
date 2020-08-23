'use strict';

module.exports = {
  up:async (queryInterface, Sequelize) => {
    return Promise.all([
      await queryInterface.addColumn(
          'teachers',
          'username', {
            type: Sequelize.DataTypes.STRING
          }
      )
    ])
  }
};
