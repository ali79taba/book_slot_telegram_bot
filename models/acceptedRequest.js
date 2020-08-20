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
      allowNull: true
    },
    userId: {
      type: Sequelize.INTEGER,
    }
  }
);

module.exports = AcceptedRequest;
