const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Vote = sequelize.define("vote", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    chatId: {
        type: Sequelize.STRING,
        allowNull: false
    },
    text: {
        type: Sequelize.STRING,
        allowNull: true
    },
});

module.exports = Vote;
