const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Admin = sequelize.define(
    "admin",
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        chatId: {
            type: Sequelize.STRING,
            allowNull: false
        }
    }
);

module.exports = Admin;
