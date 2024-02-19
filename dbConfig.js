   const Sequelize = require('sequelize');

  const sequelize = new Sequelize('trafico', 'root', 'fer12jose', {
    host: 'localhost',
    dialect: 'mysql',
  });
  
  module.exports = sequelize;