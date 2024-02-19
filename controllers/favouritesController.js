const express = require('express');
const router = express.Router();
const Incidence = require('../models/Favorite');

exports.getUserDbFav = (req, res) => {
    userModel.getUserDbFav(req.params, (error, results) => {
       console.log(results);
      if (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      //console.log(results);
      res.json(results );
    });
  };
