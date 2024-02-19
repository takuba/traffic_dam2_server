const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../dbConfig');

const FlowMeter = sequelize.define('FlowMeter', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    meterId: {
        type: DataTypes.STRING, 
        allowNull: false
    },
    provinceId: {
        type: DataTypes.STRING, 
        allowNull: false
    },
    sourceId: {
        type: DataTypes.STRING, 
        allowNull: false
    },
    municipalityId: {
        type: DataTypes.STRING, 
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
    description: {
        type: DataTypes.STRING, 
        allowNull: false
    },
    geometry: {
      type: DataTypes.GEOMETRY('LINESTRING'), 
      allowNull: true
    }
  }, {
    tableName: 'flowMeter', 
    timestamps: false 
  });
  
  module.exports = FlowMeter;