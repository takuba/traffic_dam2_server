// models/userModel.js

const mysql = require('mysql2');
const dbConfig = require('../dbConfig');

const connection = mysql.createConnection(dbConfig);

const camaraModel = {
    getAllCamaras: (callback) => {
    const query = 'SELECT * FROM camaras';
    connection.query(query, (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results);
    });
  },
};



module.exports = camaraModel;
