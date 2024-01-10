const express = require('express');
const router = express.Router();
const { cameraDbModel, cameraApiModel, camaraFullModel, cameraDbMOdelById }  = require('../models/cameraModel');
const jwt = require('jsonwebtoken');

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
exports.getAllDbCamerasById = async (req, res) => {
  console.log("EN EL CONTROLADOR DE CAMARAS: PETICION DE OBTENER USUARIOS RECIBIDA");
      try {
        console.log("EN EL CONTROLADOR DE USUARIOS: PETICION DE OBTENER USUARIOS RECIBIDA");
        const id = String(req.params.id);
        const data = await cameraDbModel.getAllDbCamerasById(id);
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
  console.log("apilocation");
      try {
        const sourceId = req.params.sourceId;
        const page = req.params.page;
        const data = await cameraApiModel.getAllApiCamerasBySourceId(sourceId,page);
        res.json(data);
      } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
};

exports.getAllCameras = async (req, res2) => {
  try {
    console.log("EN EL CONTROLADOR DE USUARIOS: PETICION DE OBTENER USUARIOS RECIBIDA");
    const resultadosCombinados = await camaraFullModel.getAllCameras();
    res2.json(resultadosCombinados);
  } catch (error) {
    res2.status(500).json({ error: 'Internal Server Error' });
  }
};

