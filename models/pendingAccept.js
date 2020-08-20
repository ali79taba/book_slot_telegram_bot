const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const pendingAccept = sequelize.define(
  "pendingAccept",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    teacherId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  }
);

module.exports = pendingAccept;
