const Sequelize = require("sequelize");

const sequelize = new Sequelize("booking", "root", "1234", {
  dialect: "mysql",
  host: "localhost",
  define: {
    charset: "utf8",
    collate: "utf8_general_ci"
  }
});

// sequelize.afterConnect(connection => {
//   return Promise.fromCallback(callback =>
//     connection.query("SET NAMES UTF8", callback)
//   );
// });

module.exports = sequelize;

// const mysql = require('mysql2');

// const pool = mysql.createPool({
//     hosts: 'localhost',
//     user: 'root',
//     database: 'booking',
//     password: '1234'
// })

// module.exports = pool.promise();
