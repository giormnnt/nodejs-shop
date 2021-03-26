const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('node-shop', 'root', '123Qwe1!', {
  dialect: 'mysql',
  host: 'localhost',
});

module.exports = sequelize;
