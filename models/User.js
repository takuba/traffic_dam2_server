const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../dbConfig');

const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    mail: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING
    },
    country: {
      type: DataTypes.STRING
    },
    age: {
      type: DataTypes.INTEGER
    },
    street: {
      type: DataTypes.STRING
    },
    role: {
      type: DataTypes.INTEGER
    }
  }, {
    tableName: 'users', 
    timestamps: false
  });
  
  module.exports = User;