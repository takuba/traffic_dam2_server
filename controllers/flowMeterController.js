const express = require('express');
const router = express.Router();
const { flowMeterDbModel,flowMeterApiModel,flowMeterFullModel }  = require('../models/flowMeterModel');
const jwt = require('jsonwebtoken');


exports.getAllDbflowMeter = async (req, res) => {
        try {
          const data = await flowMeterDbModel.getAllDbflowMeter();
          res.json(data);
        } catch (error) {
          res.status(500).json({ error: 'Internal Server Error' });
        }
};

exports.getAllDbflowMeterByMeterId = async (req, res) => {
      try {
        const meterId = String(req.params.meterId);
        const data = await flowMeterDbModel.getAllDbflowMeterByMeterId(meterId);
        res.json(data);
      } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
};

exports.getAllDbflowMeterByLocation = async (req, res) => {
      try {
        const latitude = String(req.params.latitude);
        const longitude = String(req.params.longitude);
        console.log(latitude,longitude);
        const data = await flowMeterDbModel.getAllDbflowMeterByLocation(latitude,longitude);
        res.json(data);
      } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
};

//Api
exports.getAllApiflowMeter = async (req, res) => {
    try {
      const page = req.params.page;
      const data = await flowMeterApiModel.getAllApiflowMeters(page);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
exports.getAllApiflowMeterByLocation = async (req, res) => {
    try {
        const latitude = req.params.latitude;
        const longitude = req.params.longitude;
        const radius = req.params.radius;
        const page = req.params.page;
        const data = await flowMeterApiModel.getAllApiflowMeterByLocation(latitude,longitude,radius,page);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
  
exports.getAllApiflowMetersByMeterId = async (req, res) => {
    try {
        const meterId = req.params.meterId;
        const data = await flowMeterApiModel.getAllApiflowMetersByMeterId(meterId);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getAllMeters = async (req, res2) => {
    try {
      const page = req.params.page;
      const resultadosCombinados = await flowMeterFullModel.getAllMeters(page);
      res2.json(resultadosCombinados);
    } catch (error) {
      res2.status(500).json({ error: 'Internal Server Error' });
    }
  };

  exports.getAllflowMetersByMeterId = async (req, res2) => {
    try {
      const meterId = req.params.meterId;
      const resultadosCombinados = await flowMeterFullModel.getAllflowMetersByMeterId(meterId);
      res2.json(resultadosCombinados);
    } catch (error) {
      res2.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  exports.addNewFlowMeter = async (req, res2) => {
    try {
      const {meterId, provinceId, municipalityId, description, latitude, longitude, geometry} = req.body;
      const resultadosCombinados = await flowMeterFullModel.addNewFlowMeter(meterId, provinceId, municipalityId, description, latitude, longitude, geometry);
      res2.json(resultadosCombinados);
    } catch (error) {
      res2.status(500).json({ error: 'Internal Server Error' });
    }
  };

  exports.updateFlowMeter = async (req, res) => {
    try {
      const meterId = req.params.meterId;
      const {provinceId, municipalityId, description, latitude, longitude, geometry} = req.body;
      const data = await flowMeterFullModel.updateFlowMeter(provinceId, municipalityId, description, latitude, longitude, geometry, meterId);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };