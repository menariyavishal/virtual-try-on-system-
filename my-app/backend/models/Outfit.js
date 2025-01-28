const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('postgres://username:password@localhost:5432/mydb');

const Outfit = sequelize.define('Outfit', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  size: DataTypes.STRING,
  style: DataTypes.STRING,
  availableStock: DataTypes.INTEGER
});

module.exports = Outfit;
