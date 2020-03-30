const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Rejected = sequelize.define(
    "rejected",
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
        },
        description :{
            type: Sequelize.TEXT,
            allowNull: true
        }
    }
);

module.exports = Rejected;
