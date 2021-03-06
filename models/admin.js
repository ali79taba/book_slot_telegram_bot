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
        },
        token: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        username: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        code: {
            type: Sequelize.STRING,
            allowNull: true,
        }
    }
);

module.exports = Admin;
