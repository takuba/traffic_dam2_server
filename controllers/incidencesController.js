const express = require('express');
const router = express.Router();
// const { incidencesApiModel, incidencesDbModel, incidencesFullModel }  = require('../models/incidencesModel');
const Incidence = require('../models/Incidence');

exports.deleteIncidenceBySourceId = async (req, res) => {
  const {incidenceId} = req.params;
    try {
      const deletedRows = await Incidence.destroy({
        where: {
          incidenceId: incidenceId
        }
      });
      res.json(deletedRows);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
      console.log(error);
    }
};
//Db controllers and differents methods
exports.getAllDbIncidences = async (req, res) => {
  try {
    // Utiliza el método findAll para obtener todas las incidencias
    const incidences = await Incidence.findAll({
      attributes: ['incidenceId', 'sourceId', 'incidenceType', 'autonomousRegion', 'province', 'cause', 'startDate', 'latitude', 'longitude', 'incidenceLevel', 'direction']
    });

    // Devuelve las incidencias encontradas
    // return incidences;
    res.json(incidences);

  } catch (error) {
    // Maneja cualquier error
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getAllDbIncidencesById = async (req, res) => {
  try {
    const incidenceId = req.params.incidenceId;
    const sourceId = req.params.sourceId;
    const data = await incidencesDbModel.getAllDbIncidencesById(incidenceId,sourceId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


//Api controllers and differents methods
exports.getAllApiIncidences = async (req, res) => {
  try {
    const page = req.params.page;
    const response = await fetch(`https://api.euskadi.eus/traffic/v1.0/incidences?_page=${page}`);
    const apiData = await response.json();
    const filterData = apiData.incidences.map(({ pkStart, pkEnd, road,carRegistration, ...rest }) => rest);
    const mixedResults = {
      totalItems: apiData.totalItems,
      totalPages: apiData.totalPages,
      currentPage: apiData.currentPage,
      incidences: filterData,
    };
    res.json(mixedResults);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
  };
  exports.getAllApiIncidencesById = async (req, res) => {
    try {
      const incidenceId = req.params.incidenceId;
      const sourceId = req.params.sourceId;
      const data = await incidencesApiModel.getAllApiIncidencesById(incidenceId,sourceId);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });

    }
  }

exports.getAllIncidencesByPage = async (req, res) => {

    try {
      const page = req.params.page;
      const response = await fetch(`https://api.euskadi.eus/traffic/v1.0/incidences?_page=${page}`);
      const apiData = await response.json();
      const filterData = apiData.incidences.map(({ pkStart, pkEnd, road,carRegistration, ...rest }) => rest);
      const mixedResults = {
        totalItems: apiData.totalItems,
        totalPages: apiData.totalPages,
        currentPage: apiData.currentPage,
        incidences: filterData,
      };
      const dbData = await Incidence.findAll({
        attributes: ['incidenceId', 'sourceId', 'incidenceType', 'autonomousRegion', 'province', 'cause', 'startDate', 'latitude', 'longitude', 'incidenceLevel', 'direction']
      });  
      //Incidences numbers in the db
      const itemLength = dbData.length;
      mixedResults.totalItems+=itemLength
      //mixed api and db data
      const mixedIncidences = dbData.concat(mixedResults.incidences);
  
      const mixedResult = {
        totalItems: mixedResults.totalItems,
        totalPages: mixedResults.totalPages,
        currentPage: mixedResults.currentPage,
        incidences: mixedIncidences,
      };
      const result = page == 1 ? mixedResult : mixedResults;
      res.json(result);
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
exports.getAllIncidencesById = async (req, res) => {
  const {incidenceId,sourceId} = req.params;

  try {
    const response = await fetch(`https://api.euskadi.eus/traffic/v1.0/incidences/${incidenceId}/${sourceId}`);
    const apiData = await response.json(); 
    const mixedResultDb = {
      incidences: [apiData],
    }
    res.json(mixedResultDb);
  } catch (error) {
    //res.status(500).json({ error: 'Internal Server Error' });
  }
  try {
    const results = await Incidence.findOne({
      where: {
        incidenceId: incidenceId,
        sourceId: sourceId
      }
    });
    const mixedResultDb2 = {
      incidences: [results]
    };
    res.json(mixedResultDb2);
  } catch (error) {
    
  }

};



exports.addNewIncidence = async (req, res) => {
  try {
    
    const {incidenceId, sourceId, incidenceType, autonomousRegion, province, cause, startDate,	latitude,	longitude, incidenceLevel, direction} = req.body;
    // startDate = new Date(startDate)
    const newIncidence = await Incidence.create({
      incidenceId,
      sourceId,
      incidenceType,
      autonomousRegion,
      province,
      cause,
      startDate,
      latitude,
      longitude,
      incidenceLevel,
      direction
    });
    res.json(newIncidence);
  } catch (error) {
    console.log(error);
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

