const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const LastRequest = sequelize.define(
    "last_request",
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
        state: {
            type: Sequelize.STRING,
            allowNull: true
        }
    }
);

module.exports = LastRequest;
