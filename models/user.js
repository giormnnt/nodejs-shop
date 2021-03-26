const { DataTypes } = require('sequelize');

const sequelize = require('../util/database');

const User = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  name: DataTypes.STRING,
  email: DataTypes.STRING,
});

module.exports = User;
