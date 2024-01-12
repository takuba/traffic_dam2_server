const express = require('express');
const router = express.Router();
const { incidencesApiModel, incidencesDbModel, incidencesFullModel }  = require('../models/incidencesModel');

//Db controllers and differents methods
exports.getAllDbIncidences = async (req, res) => {
      try {
        const data = await incidencesDbModel.getAllDbIncidences();
        res.json(data);
      } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
};

exports.getAllDbIncidencesByYear = async (req, res) => {
      try {
        const year = req.params.year;
        console.log(year);
        const data = await incidencesDbModel.getAllDbIncidencesByYear(year);
        res.json(data);
      } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
};

exports.getAllDbIncidencesByLocation = async (req, res) => {
  try {
    const year = req.params.year;
    const month = req.params.month;
    const latitude = String(req.params.latitude);
    const longitude = String(req.params.longitude);
    const data = await incidencesDbModel.getAllDbIncidencesByLocation(year, month, latitude, longitude);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


//Api controllers and differents methods
exports.getAllApiIncidences = async (req, res) => {
    try {
      const page = req.params.page;
      const data = await incidencesApiModel.getAllApiIncidences(page);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  exports.getAllApiIncidencesByLocation = async (req, res) => {
    try {
      const year = req.params.year;
      const month = req.params.month;
      const latitude = req.params.latitude;
      const longitude = req.params.longitude;
      const radius = req.params.radius;
      const page = req.params.page;
      const data = await incidencesApiModel.getAllApiIncidencesByLocation(year, month, latitude, longitude, radius, page);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  exports.getAllApiIncidencesByYear = async (req, res) => {
    try {
      const year = req.params.year;
      const page = req.params.page;
      const data = await incidencesApiModel.getAllApiIncidencesByYear(year, page);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

exports.getAllIncidencesByPage = async (req, res) => {
  try {
    const page = req.params.page;
    const data = await incidencesFullModel.getAllIncidencesByPage(page);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getAllIncidencesByYear = async (req, res) => {
  try {
    const year = req.params.year;
    const page = req.params.page;
    const data = await incidencesFullModel.getAllIncidencesByYear(year, page);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getAllIncidencesByLocation = async (req, res) => {
  try {
    const year = req.params.year;
    const month = req.params.month;
    const latitude = req.params.latitude;
    const longitude = req.params.longitude;
    const radius = req.params.radius;
    const page = req.params.page;
    const data = await incidencesFullModel.getAllIncidencesByLocation(year, month, latitude, longitude, radius, page);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.addNewIncidence = async (req, res) => {
  try {
    const {incidenceId, sourceId, incidenceType, autonomousRegion, province, cause, startDate,	latitude,	longitude, incidenceLevel, direction} = req.body;
    const data = await incidencesFullModel.addNewIncidence(incidenceId, sourceId, incidenceType, autonomousRegion, province, cause, new Date(startDate),	latitude,	longitude, incidenceLevel, direction);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateIncidence = async (req, res) => {
  try {
    const incidenceId = req.params.incidenceId;
    req.body.startDate = new Date(req.body.startDate)
    const data = await incidencesFullModel.updateIncidence(req.body,String(incidenceId));
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
