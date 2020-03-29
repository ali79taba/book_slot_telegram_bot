const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const AcceptedRequest = sequelize.define(
  "acceptedRequest",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    teacherId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: true
    },
    userId: {
      type: Sequelize.INTEGER,
      primaryKey: true
    }
  }
);

module.exports = AcceptedRequest;
