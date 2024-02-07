// models/userModel.js

const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const dbConfig = require('../dbConfig');

const connection = mysql.createConnection(dbConfig);

const userModel = {
  createUser: (user, callback) => {
    const {  mail, password, name, city, country, age, street } = user;

    // Encriptar la contraseña antes de almacenarla en la base de datos
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return callback(err, null);
      }

      const query = 'INSERT INTO users ( mail, password, name, city, country, age, street) VALUES ( ?, ?, ?, ?, ?, ?, ?)';
      connection.query(query, [mail, hashedPassword, name, city, country, age, street], (error, results) => {
        if (error) {
          return callback(error, null);
        }
        callback(null, results);
      });
    });
  },
  getUserByEmail: (mail, callback) => {
    const query = 'SELECT * FROM users WHERE mail = ?';
    connection.query(query, [mail], (error, results) => {
      if (error) {
        return callback(error, null);
      }
      callback(null, results[0]);
    });
  },
  getUserFav: (data, callback) => {
    const {  user_id, fav_id, sourceId} = data;
    const query = 'SELECT * FROM favourites WHERE user_id = ? AND fav_id = ? AND sourceId = ?';
    connection.query(query, [user_id,fav_id,sourceId], (error, results) => {
      if (error) {
        return callback(error, null);
      }
      callback(null, results);
    });
  },
  getUserInfo: (data, callback) => {
    const {  user_id} = data;
    const query = 'SELECT * FROM users WHERE id = ?';
    connection.query(query, [user_id], (error, results) => {
      if (error) {
        return callback(error, null);
      }
      callback(null, results);
    });
  },
  getUserDbFav: (data, callback) => {
    const {  user_id, type} = data;
    const query = 'SELECT * FROM favourites WHERE user_id = ? AND type = ?';
    connection.query(query, [user_id,type], (error, results) => {
      if (error) {
        return callback(error, null);
      }
      callback(null, results);
    });
  },
  uploadUserFav: (user, callback) => {
    const {  user_id, type, fav_id, sourceId, page, name} = user;
    const query = 'INSERT INTO favourites ( user_id, type, fav_id, sourceId, page, name) VALUES ( ?, ?, ?, ?, ?, ?)';
    connection.query(query, [user_id,type,fav_id, sourceId, page, name], (error, results) => {
      if (error) {
        return callback(error, null);
      }
      callback(null, results[0]);
    });
  },
  deletedUserFav: (item, callback) => {
    const {  user_id, type, fav_id, sourceId} = item;
    const query = 'DELETE FROM favourites WHERE user_id = ? AND type = ? AND fav_id = ? AND sourceId = ?';
    connection.query(query, [user_id,type,fav_id, sourceId], (error, results) => {
      if (error) {
        return callback(error, null);
      }
      callback(null, results);
    });
  },
};

module.exports = userModel;
