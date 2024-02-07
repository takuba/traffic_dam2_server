const mysql = require('mysql2');
const dbConfig = require('../dbConfig');
const utm = require('utm');

const connection = mysql.createConnection(dbConfig);

//CameraModel with diferents filters
const cameraDbModel = {
  getAllDbCameras: async () => {
    try {
      const query = 'SELECT cameraId, cameraName, urlImage, latitude, longitude, sourceId FROM cameras';
      const [results] = await connection.promise().query(query);
      results.forEach(it => {
        switch (it.sourceId) {
          case "1":
            it.sourceName = 'Gobierno País Vasco';
            break;
          case "2":
            it.sourceName = 'Diputación Foral de Bizkaia';
            break;
          case "3":
            it.sourceName = 'Diputación Foral de Álava';
            break;
          case "4":
            it.sourceName = 'Diputación Foral de Gipuzkoa';
            break;
          case "5":
            it.sourceName = 'Ayuntamiento Bilbao';
            break;
          case "6":
            it.sourceName = 'Ayuntamiento Vitoria-Gasteiz';
            break;
          case "7":
            it.sourceName = 'Ayuntamiento de Donostia-San Sebastián';
            break;
          default:
            it.sourceName = item.sourceId;
        }
      });
      return results;
    } catch (error) {
      throw error;
    }
  }, 
  getAllDbCamerasBySourceId: async (cameraId,sourceId) => {
    try {
      const query = 'SELECT cameraId, cameraName, urlImage, latitude, longitude, sourceId FROM cameras WHERE cameraId = ? AND sourceId = ?';
      const [results] = await connection.promise().query(query, [cameraId,sourceId]);
      return results;
    } catch (error) {
      throw error;
    }
  },
  getAllDbCamerasByLocation: async (latitude,longitude) => {
    try {
      const query = 'SELECT cameraId, cameraName, urlImage, latitude, longitude, sourceId FROM cameras WHERE latitude = ? AND longitude = ?';
      const [results] = await connection.promise().query(query, [latitude,longitude]);
      return results;
    } catch (error) {
      throw error;
    }
  }
};

//get all cameras from api
const cameraApiModel = {
  getAllApiCameras: async (page) => {
    try {
      const response = await fetch(`https://api.euskadi.eus/traffic/v1.0/cameras?_page=${page}`);
      const apiData = await response.json();
      const filterData = apiData.cameras.map(({ road, kilometer, address, ...rest }) => rest);

      const mixedResults = {
        totalItems: apiData.totalItems,
        totalPages: apiData.totalPages,
        currentPage: apiData.currentPage,
        cameras: filterData,
      };

      return mixedResults;
    } catch (error) {
      throw error;
    }
  },
  getAllApiCamerasByLocation: async (latitude, longitude, radius, page) => {
    try {
      const response = await fetch(`https://api.euskadi.eus/traffic/v1.0/cameras/byLocation/${latitude}/${longitude}/${radius}?_page=${page}`);
      const apiData = await response.json();
      const filterData = apiData.cameras.map(({ road, kilometer, address, ...rest }) => rest);
      const mixedResults = {
        totalItems: apiData.totalItems,
        totalPages: apiData.totalPages,
        currentPage: apiData.currentPage,
        cameras: filterData,
      };

      return mixedResults;
    } catch (error) {
      throw error;
    }
  },
  getAllApiCamerasBySourceId: async (cameraId,sourceId) => {
    try {
      const response = await fetch(`https://api.euskadi.eus/traffic/v1.0/cameras/${cameraId}/${sourceId}`);
      const apiData = await response.json();
      return apiData;
    } catch (error) {
      throw error;
    }
  }    
}

//This method is to get all cameras from DB and Api together
const camaraFullModel = {

  getAllCameras: async (page) => {
    try {
      const apiData = await cameraApiModel.getAllApiCameras(page);
      const dbData = await cameraDbModel.getAllDbCameras();
      // console.log(dbData);
      const zoneNumber = 30;
      const northernHemisphere = true;
      const hemisphere = 'N';
      apiData.cameras.forEach((element) => {
        //console.log(element.latitude);
        //console.log(element.longitude);
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
        const decimalDegrees = utmToDecimalDegrees(element.longitude,element.latitude,zoneNumber,hemisphere);
        console.log(decimalDegrees.longitude);
        element.latitude = decimalDegrees.latitude;
        element.longitude = decimalDegrees.longitude;
        
      });
      //camera numbers in the db
      const itemLength = dbData.length;
      apiData.totalItems+=itemLength;

      //mixed api and db data
      const mixedCameras = dbData.concat(apiData.cameras);

      const mixedResult = {
        totalItems: apiData.totalItems,
        totalPages: apiData.totalPages,
        currentPage: apiData.currentPage,
        cameras: mixedCameras,
      };
      //console.log(apiData.cameras);


      //console.log(apiData);

      const result = page == 1 ? mixedResult : apiData;
      return result;
    } catch (error) {
      throw error;
    }
  },
  getAllCamerasByLocation: async (latitude, longitude, radius, page) => {
    try {
      const apiData = await cameraApiModel.getAllApiCamerasByLocation(latitude, longitude, radius, page);
      const dbData = await cameraDbModel.getAllDbCamerasByLocation(latitude,longitude);

      //camera numbers in the db
      const itemLength = dbData.length;
      apiData.totalItems+=itemLength;
      //mixed api and db data
      const mixedCameras = dbData.concat(apiData.cameras);

      const mixedResult = {
        totalItems: apiData.totalItems,
        totalPages: apiData.totalPages,
        currentPage: apiData.currentPage,
        cameras: mixedCameras,
      };
      const result = page == 1 ? mixedResult : apiData;
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  getAllCamerasBySourceId: async (cameraId,sourceId) => {
    try {
      const apiData = await cameraApiModel.getAllApiCamerasBySourceId(cameraId, sourceId);
      const dbData = await cameraDbModel.getAllDbCamerasBySourceId(cameraId,sourceId);

      const zoneNumber = 30;
      const hemisphere = 'N';
      const mixedCameras = dbData.concat(apiData);
      mixedCameras.forEach((element) => {
          const decimalDegrees = utmToDecimalDegrees(element.longitude,element.latitude,zoneNumber,hemisphere);
          element.latitude = decimalDegrees.latitude;
          element.longitude = decimalDegrees.longitude;

      });
      const mixedResult = {
        cameras: mixedCameras
      };
      return mixedResult;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  addNewCamera: async(cameraId, sourceId, cameraName, urlImage, latitude, longitude) => {
    try {
      const query = 'INSERT INTO cameras ( cameraId, sourceId, cameraName, urlImage, latitude, longitude) VALUES ( ?, ?, ?, ?, ?, ?)';
      const [results] = await connection.promise().query(query, [cameraId, sourceId, cameraName, urlImage, latitude, longitude]);
      return results;
    } catch (error) {
      console.log("error in addNewIncidence ", error);
      throw error;
    }

  },
  updateCamera : async(updatedCamera, cameraId) => {
    try {
      const query = 'UPDATE cameras SET ? WHERE cameraId = ?';
      const [results] = await connection.promise().query(query, [updatedCamera, cameraId]);
      return results;
    } catch (error) {
      console.log("error in addNewIncidence ", error);
      throw error;
    }

  }
};
function utmToDecimalDegrees(easting, northing, zoneNumber, hemisphere) {
  try {
    const result = utm.toLatLon(easting, northing, zoneNumber, hemisphere);
   // console.log(result.longitude);
    //console.log(result.latitude);
    return { longitude: String(result.longitude), latitude: String(result.latitude) };
  } catch (error) {
    //console.error(`Error en la transformación UTM a decimal: ${error.message}`);
    // Si la transformación falla, devolver las coordenadas originales
    return { longitude: easting, latitude: northing };
  }
}
module.exports = {
  cameraDbModel,
  cameraApiModel,
  camaraFullModel
};
