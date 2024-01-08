// models/userModel.js

const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const dbConfig = require('../dbConfig');

const connection = mysql.createConnection(dbConfig);

const userModel = {
  createUser: (user, callback) => {
    const {  email, password } = user;

    // Encriptar la contraseña antes de almacenarla en la base de datos
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return callback(err, null);
      }

      const query = 'INSERT INTO usuarios ( email, password) VALUES ( ?, ?)';
      connection.query(query, [email, hashedPassword], (error, results) => {
        if (error) {
          return callback(error, null);
        }
        callback(null, results);
      });
    });
  },

  getUserByEmail: (email, callback) => {
    const query = 'SELECT * FROM usuarios WHERE email = ?';
    connection.query(query, [email], (error, results) => {
      if (error) {
        return callback(error, null);
      }
      callback(null, results[0]);
    });
  },
};

module.exports = userModel;
