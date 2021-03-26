const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123Qwe1!',
  database: 'node-shop',
});

module.exports = pool.promise();
