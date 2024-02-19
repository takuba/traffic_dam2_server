const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../dbConfig');

// Define el modelo de Incidencia
const Incidence = sequelize.define('Incidence', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    incidenceId: {
        type: DataTypes.STRING, 
        allowNull: false
    },
    sourceId: {
        type: DataTypes.STRING, 
        allowNull: false
    },
    incidenceType: {
        type: DataTypes.STRING, 
        allowNull: false
    },
    autonomousRegion: {
      type: DataTypes.STRING, 
      allowNull: false
    },
    province: {
      type: DataTypes.STRING, 
      allowNull: false
    },
    cause: {
      type: DataTypes.STRING,
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    latitude: {
      type: DataTypes.STRING,
      allowNull: false
    },
    longitude: {
        type: DataTypes.STRING,
        allowNull: false
    },
    incidenceLevel: {
      type: DataTypes.STRING,
      allowNull: false
    },
    direction: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'incidences', 
    timestamps: false 
  });
  
  module.exports = Incidence;
