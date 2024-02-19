const { cameraDbModel, cameraApiModel, camaraFullModel, cameraDbMOdelById }  = require('../models/cameraModel');
// const jwt = require('jsonwebtoken');
const utm = require('utm');
const Camera = require('../models/Camera');

//Cameras DataBase Methods
exports.getAllDbCameras = async (req, res) => {
          try {
          const data = await cameraDbModel.getAllDbCameras();
          
          res.json(data);
        } catch (error) {
          res.status(500).json({ error: 'Internal Server Error' });
        }
};

//get all camera from db by id
exports.getAllDbCamerasBySourceId = async (req, res) => {
      try {
        const cameraId = String(req.params.cameraId);
        const sourceId = String(req.params.sourceId);
        const data = await cameraDbModel.getAllDbCamerasBySourceId(cameraId,sourceId);
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
exports.deleteCamerasBySourceId = async (req, res) => {
  const {cameraId} = req.params;
    try {
      const deletedRows = await Camera.destroy({
        where: {
          cameraId: cameraId
        }
      });
      res.json(deletedRows);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
      console.log(error);
    }
  
}
exports.getAllApiCamerasBySourceId = async (req, res) => {
      try {
        const cameraId = req.params.cameraId;
        const sourceId = req.params.sourceId;
        const data = await cameraApiModel.getAllApiCamerasBySourceId(cameraId,sourceId);
        res.json(data);
      } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
};

exports.getAllCameras = async (req, res2) => {
  try {
    const page = req.params.page;
    const resultadosCombinados = await camaraFullModel.getAllCameras(page);
    res2.json(resultadosCombinados);
  } catch (error) {
    console.log(error);
    res2.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getAllCamerasBySourceId = async (req, res2) => {
  try {
    const {cameraId,sourceId} = req.params;
    const response = await fetch(`https://api.euskadi.eus/traffic/v1.0/cameras/${cameraId}/${sourceId}`);
    const apiData = await response.json();
    delete apiData.road;
    delete apiData.kilometer;
    delete apiData.address;
    setTheLocationUtmToDecimal([apiData])
    getSourceNameByCameras([apiData]);

    const cameras = await Camera.findAll({
      attributes: ['cameraId', 'cameraName', 'urlImage', 'latitude', 'longitude', 'sourceId','sourceName'],
      where: {
        cameraId: cameraId,
        sourceId: sourceId
      }
    });
    const mixedCameras = cameras.concat(apiData);
    const mixedResult = {
      cameras: mixedCameras
    };
    res2.json(mixedResult);
  } catch (error) {
    res2.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.addNewCamera = async (req, res) => {
  try {
    const {cameraId, sourceId, cameraName, urlImage, latitude, longitude} = req.body;
    const data = await camaraFullModel.addNewCamera(cameraId, sourceId, cameraName, urlImage, latitude, longitude);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateCamera = async (req, res) => {
  try {
    const cameraId = req.params.cameraId;
    const data = await camaraFullModel.updateCamera(req.body,cameraId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Función para generar un token JWT
function generateToken(user) {
  const secretKey = 'tu_clave_secreta';
  return jwt.sign({ user }, secretKey, { expiresIn: '1h' }); // Expira en 1 hora
}

//raw function to transforma utm to decimal
function utmToDecimalDegrees(easting, northing, zoneNumber, hemisphere) {
  try {
    const result = utm.toLatLon(easting, northing, zoneNumber, hemisphere);
    return { longitude: String(result.longitude), latitude: String(result.latitude) };
  } catch (error) {
    return { longitude: easting, latitude: northing };
  }
}
//function to transform location properties from a array
const setTheLocationUtmToDecimal=(array)=>{
  array.forEach((element) => {
    const decimalDegrees = utmToDecimalDegrees(element.longitude,element.latitude,30,'N');
    console.log(decimalDegrees.longitude);
    element.latitude = decimalDegrees.latitude;
    element.longitude = decimalDegrees.longitude;
    
  });
}

const getSourceNameByCameras=(array)=>{
  array.forEach(element => {
    switch (element.sourceId) {
      case "1":
        element.sourceName = 'Gobierno País Vasco';
        break;
      case "2":
        element.sourceName = 'Diputación Foral de Bizkaia';
        break;
      case "3":
        element.sourceName = 'Diputación Foral de Álava';
        break;
      case "4":
        element.sourceName = 'Diputación Foral de Gipuzkoa';
        break;
      case "5":
        element.sourceName = 'Ayuntamiento Bilbao';
        break;
      case "6":
        element.sourceName = 'Ayuntamiento Vitoria-Gasteiz';
        break;
      case "7":
        element.sourceName = 'Ayuntamiento de Donostia-San Sebastián';
        break;
      default:
        element.sourceName = item.sourceId;
    }
  });
}