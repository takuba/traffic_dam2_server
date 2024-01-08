const express = require('express');
const router = express.Router();
const userModel = require('../models/camarasModelo');
const jwt = require('jsonwebtoken');

// Función para generar un token JWT
function generateToken(user) {
    const secretKey = 'tu_clave_secreta'; // Cambia esto por una clave segura
    return jwt.sign({ user }, secretKey, { expiresIn: '1h' }); // Expira en 1 hora (ajusta según tus necesidades)
  }
  
exports.getAllCamaras = (req, res2) => {
    console.log("EN EL CONTROLADOR DE USUARIOS: PETICION DE OBTENER USUARIOS RECIBIDA");
        userModel.getAllCamaras((error, camaras) => {
          if (error) {
            return res2.status(500).json({ error: 'Internal Server Error' });
          }
          //console.log(token);
          const token = generateToken(camaras);
          res2.json({ camaras, token });
          //res2.status(200).send(res.json(camaras));
        });
    
};

