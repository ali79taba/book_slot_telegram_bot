const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const TimeSlot = sequelize.define(
    "timeSlot",
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
        description: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        userId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        col:{
            type: Sequelize.INTEGER,
            allowNull: false
        }
    }
);

module.exports = TimeSlot;
