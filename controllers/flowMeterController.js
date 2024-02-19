const express = require('express');
const router = express.Router();
// const { flowMeterDbModel,flowMeterApiModel,flowMeterFullModel }  = require('../models/flowMeterModel');
const jwt = require('jsonwebtoken');
const FlowMeter = require('../models/Flowmeter');


exports.deleteMeterBySourceId = async (req, res) => {
  const {meterId} = req.params;
    try {
      const deletedRows = await FlowMeter.destroy({
        where: {
          meterId: meterId
        }
      });
      res.json(deletedRows);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
      console.log(error);
    }
}


exports.getAllflowMetersByMeterId = async (req, res) => {
  const {meterId} = req.params;
  try {
    const results = await FlowMeter.findOne({
      attributes: ['meterId', 'provinceId', 'sourceId', 'municipalityId', 'description', 'latitude', 'longitude', 'geometry'],
      where: {
        meterId: meterId
      }
    });

    const arrayTransformado = [results].map(objeto => ({
      "type": "Feature",
      "properties": {
        "meterId": objeto.meterId,
        "description": objeto.description,
        "sourceId": objeto.sourceId,
        "provinceId": objeto.provinceId,
        "municipalityId": objeto.municipalityId,
        "latitude": objeto.latitude,
        "longitude": objeto.longitude
      },
      "geometry": {
        "type": "LineString",
        "coordinates": objeto.geometry.coordinates
      }
    }));
    const combinedObject = {features:[Object.assign({}, ...arrayTransformado)]};
    res.json(combinedObject);

  } catch (error) {
    console.log(error);
  }
  try {
    const response = await fetch(`https://api.euskadi.eus/traffic/v1.0/meters/${meterId}`);
    const apiData = await response.json();
    const filteredData = {
      ...apiData,
      properties: {
        ...apiData.properties,
        system: undefined,
        municipality: undefined,
        province: undefined,
        meterCode:undefined,
      },
    };
    res.json({features:[filteredData]});
  } catch (error) {
    console.log(error);

  }

  }


exports.getAllMeters = async (req, res) => {
  try {
    const page = req.params.page;

    const response = await fetch(`https://api.euskadi.eus/traffic/v1.0/meters?_page=${page}`);
    const apiData = await response.json();
    const filterData = {
      ...apiData,
      features: apiData.features.map(({ geometry, properties: { municipality, province,system,meterCode, ...restProperties }, ...rest }) => ({
        ...rest,
        properties: {
          ...restProperties,
        },
        geometry,
      })),
    };
    
      // Obtener todos los registros de la tabla FlowMeter
      const results = await FlowMeter.findAll({
        attributes: ['meterId', 'provinceId', 'sourceId', 'municipalityId', 'description', 'latitude', 'longitude']
      });
      
      // Transformar los resultados según sea necesario
      const arrayTransformado = results.map(objeto => ({
        type: 'Feature',
        properties: {
          meterId: objeto.meterId,
          sourceId: objeto.sourceId,
          description: objeto.description,
          provinceId: objeto.provinceId,
          municipalityId: objeto.municipalityId,
          latitude: objeto.latitude,
          longitude: objeto.longitude
        },
      }));
  
      const itemLength = arrayTransformado.length;
      filterData.totalItems+=itemLength;
      //mixed api and db data
      const mixedCameras = arrayTransformado.concat(filterData.features);

      const mixedResult = {
        totalItems: filterData.totalItems,
        totalPages: filterData.totalPages,
        currentPage: filterData.currentPage,
        type: "FeatureCollection",
        features: mixedCameras,
      };
      const result = page == 1 ? mixedResult : filterData;

      
      res.json(result);

  } catch (error) {
    console.log(error);
    throw error;
  }
};

exports.addNewFlowMeter = async (req, res) => {
  
    try {
      const {provinceId,sourceId, municipalityId, description, latitude, longitude} = req.body;

      // Generar un número aleatorio para meterId
      const numeroAleatorio = Math.floor(Math.random() * (90000) + 10000);
      meterId = numeroAleatorio;
  
      // Insertar el nuevo registro en la tabla flowMeter
      const result = await FlowMeter.create({
        meterId: meterId,
        sourceId:sourceId,
        provinceId: provinceId,
        municipalityId: municipalityId,
        description: description,
        latitude: latitude,
        longitude: longitude,
      });
  
      console.log(result);
      res.json(result);

    } catch (error) {
      console.log("Error en addNewFlowMeter: ", error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
};

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
exports.getAllDbflowMeterById = async (req, res) => {
  try {
    const meterId = String(req.params.meterId);
    const sourceId = String(req.params.sourceId);
    const data = await flowMeterDbModel.getAllDbflowMeterById(meterId,sourceId);
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