const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../dbConfig');
// Define el modelo Favorite
// Define el modelo Favorite
const Favorite = sequelize.define('Favorite', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING, // Ajusta el tipo de dato según corresponda
      allowNull: false
    },
    fav_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sourceId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    page: {
      type: DataTypes.INTEGER, // Ajusta el tipo de dato según corresponda
      allowNull: true
    },
    name: {
      type: DataTypes.STRING, // Ajusta el tipo de dato según corresponda
      allowNull: true
    }
  }, {
    tableName: 'favourites', // Nombre real de la tabla en la base de datos (en minúsculas)
    timestamps: false // No incluir createdAt y updatedAt
  });
  
  // Exporta el modelo Favorite
  module.exports = Favorite;
