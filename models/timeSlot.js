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
            allowNull: true,
        },
        userId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        col:{
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 10,
        },
        isString: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        startDate: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        endDate: {
            type: Sequelize.INTEGER,
            allowNull: true
        }

    }
);

module.exports = TimeSlot;
