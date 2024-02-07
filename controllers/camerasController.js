const express = require('express');
const router = express.Router();
const { cameraDbModel, cameraApiModel, camaraFullModel, cameraDbMOdelById }  = require('../models/cameraModel');
const jwt = require('jsonwebtoken');
const utm = require('utm');
function utmToDecimalDegrees(easting, northing, zoneNumber, northernHemisphere) {
  const result = utm.toLatLon(easting, northing, zoneNumber, northernHemisphere);
  return { latitude: result.latitude, longitude: result.longitude };
}
// Función para generar un token JWT
function generateToken(user) {
    const secretKey = 'tu_clave_secreta';
    return jwt.sign({ user }, secretKey, { expiresIn: '1h' }); // Expira en 1 hora
}
//Cameras DataBase Methods

//get all cameras from db
exports.getAllDbCameras = async (req, res) => {
  
    console.log("EN EL CONTROLADOR DE CAMARAS: PETICION DE OBTENER USUARIOS RECIBIDA");
        try {
          console.log("EN EL CONTROLADOR DE USUARIOS: PETICION DE OBTENER USUARIOS RECIBIDA");
          const data = await cameraDbModel.getAllDbCameras();
          res.json(data);
        } catch (error) {
          res.status(500).json({ error: 'Internal Server Error' });
        }
};

//get all camera from db by id
exports.getAllDbCamerasBySourceId = async (req, res) => {
      try {
        const cameraId = String(req.params.cameraId);
        const sourceId = String(req.params.sourceId);
        const data = await cameraDbModel.getAllDbCamerasBySourceId(cameraId,sourceId);
        res.json(data);
      } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
};

//get all camera from db by latitude and longitude
exports.getAllDbCamerasByLocation = async (req, res) => {
  console.log("EN EL CONTROLADOR DE CAMARAS: PETICION DE OBTENER USUARIOS RECIBIDA");
      try {
        console.log("EN EL CONTROLADOR DE USUARIOS: PETICION DE OBTENER USUARIOS RECIBIDA");
        const latitude = String(req.params.latitude);
        const longitude = String(req.params.longitude);
        console.log(latitude,longitude);
        const data = await cameraDbModel.getAllDbCamerasByLocation(latitude,longitude);
        res.json(data);
      } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
};


exports.getAllApiCameras = async (req, res) => {
  try {
    const page = req.params.page;
    const data = await cameraApiModel.getAllApiCameras(page);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getAllApiCamerasByLocation = async (req, res) => {
  console.log("apilocation");
      try {
        const latitude = req.params.latitude;
        const longitude = req.params.longitude;
        const radius = req.params.radius;
        const page = req.params.page;
        const data = await cameraApiModel.getAllApiCamerasByLocation(latitude,longitude,radius,page);
        res.json(data);
      } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
};

exports.getAllApiCamerasBySourceId = async (req, res) => {
      try {
        const cameraId = req.params.cameraId;
        const sourceId = req.params.sourceId;
        const data = await cameraApiModel.getAllApiCamerasBySourceId(cameraId,sourceId);
        res.json(data);
      } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
};

exports.getAllCameras = async (req, res2) => {
  try {
    const page = req.params.page;
    const resultadosCombinados = await camaraFullModel.getAllCameras(page);
    res2.json(resultadosCombinados);
  } catch (error) {
    res2.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getAllCamerasByLocation = async (req, res2) => {
  try {
    const {latitude, longitude, radius, page} = req.params;
    const resultadosCombinados = await camaraFullModel.getAllCamerasByLocation(latitude, longitude, radius, page);
    res2.json(resultadosCombinados);
  } catch (error) {
    res2.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getAllCamerasBySourceId = async (req, res2) => {
  try {
    const {cameraId,sourceId} = req.params;
    const resultadosCombinados = await camaraFullModel.getAllCamerasBySourceId(cameraId,sourceId);
    res2.json(resultadosCombinados);
  } catch (error) {
    res2.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.addNewCamera = async (req, res) => {
  try {
    const {cameraId, sourceId, cameraName, urlImage, latitude, longitude} = req.body;
    const data = await camaraFullModel.addNewCamera(cameraId, sourceId, cameraName, urlImage, latitude, longitude);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
exports.updateCamera = async (req, res) => {
  try {
    const cameraId = req.params.cameraId;
    const data = await camaraFullModel.updateCamera(req.body,cameraId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
