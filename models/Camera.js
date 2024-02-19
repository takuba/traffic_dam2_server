const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../dbConfig');

const Camera = sequelize.define('Camera', {
  cameraId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  cameraName: {
    type: DataTypes.STRING,
  },
  urlImage: {
    type: DataTypes.STRING,
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
  },
  sourceId: {
    type: DataTypes.INTEGER,
  },
  sourceName: {
    type: DataTypes.INTEGER,
  },
}, {
  timestamps: false,
  tableName: 'cameras', // Deshabilita el marcado de tiempo automático
});


module.exports = Camera;
