const { Sequelize, Model, DataTypes } = require("sequelize");

const sequelize = require("../util/database");

const Teacher = sequelize.define("teacher", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  first_name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  last_name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  field: {
    type: Sequelize.STRING,
    allowNull: false
  },
  chatId: {
    type: Sequelize.STRING,
    allowNull: true
  },
  gerayesh:{
    type: Sequelize.STRING,
    allowNull: true
  }, code: {
    type: Sequelize.STRING,
    allowNull: true
  },
  image_link:{
    type: Sequelize.TEXT,
    allowNull: true
  },
  description:{
    type: Sequelize.TEXT,
    allowNull: true
  },
  contact:{
    type: Sequelize.STRING,
    allowNull: true
  },
  username: {
    type: Sequelize.STRING,
    allowNull: true,
    unique : true,
  },
  token:{
    type: Sequelize.STRING,
    allowNull: true,
  },
  dontSendRequestNotificationBot:{
    type: Sequelize.BOOLEAN,
    allowNull: true,
  },
  email:{
    type: Sequelize.STRING,
    allowNull: true,
  }

});


module.exports = Teacher;
