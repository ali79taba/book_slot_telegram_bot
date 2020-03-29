const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const User = sequelize.define("user", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  chatId: {
    type: Sequelize.STRING,
    allowNull: false
  },
  name: {
    type: Sequelize.STRING,
    allowNull: true
  },
  phone_number: {
    type: Sequelize.STRING,
    allowNull: true
  },
  field: {
    type: Sequelize.STRING,
    allowNull: true
  },
  gerayesh :{
    type: Sequelize.STRING,
    allowNull: true
  },
  intresting: {
    type: Sequelize.STRING,
    allowNull: true
  },
  timeSlotId: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  grade:{
    type: Sequelize.STRING,
    allowNull: true
  },
  uni:{
    type:Sequelize.STRING,
    allowNull: true
  },
  limit_request_number:{
    type:Sequelize.STRING,
    allowNull: true
  }
});

// User.associate = function(models) {
//   User.belongsToMany(models.Teacher, {
//     through: 'TeacherUser',
//     as: 'Teachers',
//     foreignKey: 'userId',
//     otherKey: 'teacherId'
//   });
// };

module.exports = User;
