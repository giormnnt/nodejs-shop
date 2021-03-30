const { DataTypes } = require('sequelize');

const sequelize = require('../util/database');

// * sequelize.define creates a table.
// * first parameter is the name of the table
// * and rows as second parameter
const Cart = sequelize.define('cart', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
});

module.exports = Cart;
