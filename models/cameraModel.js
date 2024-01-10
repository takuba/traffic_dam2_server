const mysql = require('mysql2');
const dbConfig = require('../dbConfig');

const connection = mysql.createConnection(dbConfig);

//CameraModel with diferents filters
const cameraDbModel = {
  getAllDbCameras: async () => {
    try {
      const query = 'SELECT cameraId, cameraName, urlImage, latitude, longitude, sourceId FROM camaras';
      const [results] = await connection.promise().query(query);
      return results;
    } catch (error) {
      throw error;
    }
  }, 
  getAllDbCamerasById: async (id) => {
    try {
      const query = 'SELECT cameraId, cameraName, urlImage, latitude, longitude, sourceId FROM camaras WHERE cameraId = ?';
      const [results] = await connection.promise().query(query, [id]);
      return results;
    } catch (error) {
      throw error;
    }
  },
  getAllDbCamerasByLocation: async (latitude,longitude) => {
    try {
      const query = 'SELECT cameraId, cameraName, urlImage, latitude, longitude, sourceId FROM camaras WHERE latitude = ? AND longitude = ?';
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
  getAllApiCamerasBySourceId: async (sourceId, page) => {
    try {
      const response = await fetch(`https://api.euskadi.eus/traffic/v1.0/cameras/bySource/${sourceId}?_page=${page}`);
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
  }    
}

//This method is to get all cameras from DB and Api together
const camaraFullModel = {

  getAllCameras: async () => {
    try {
      const apiData = await cameraApiModel.getAllApiCameras(1);
      const dbData = await cameraDbModel.getAllDbCameras();

      //camera numbers in the db
      const itemLength = dbData.length;
      //mixed api and db data
      const mixedCameras = dbData.concat(apiData.cameras);

      const mixedResult = {
        totalItems: apiData.totalItems+itemLength,
        totalPages: apiData.totalPages,
        currentPage: apiData.currentPage,
        camerasAPI: mixedCameras,
      };

      return mixedResult;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = {
  cameraDbModel,
  cameraApiModel,
  camaraFullModel
};
