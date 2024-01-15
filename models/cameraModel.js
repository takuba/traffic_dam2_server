const mysql = require('mysql2');
const dbConfig = require('../dbConfig');

const connection = mysql.createConnection(dbConfig);

//CameraModel with diferents filters
const cameraDbModel = {
  getAllDbCameras: async () => {
    try {
      const query = 'SELECT cameraId, cameraName, urlImage, latitude, longitude, sourceId FROM cameras';
      const [results] = await connection.promise().query(query);
      return results;
    } catch (error) {
      throw error;
    }
  }, 
  getAllDbCamerasBySourceId: async (id) => {
    try {
      const query = 'SELECT cameraId, cameraName, urlImage, latitude, longitude, sourceId FROM cameras WHERE sourceId = ?';
      const [results] = await connection.promise().query(query, [id]);
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

  getAllCameras: async (page) => {
    try {
      const apiData = await cameraApiModel.getAllApiCameras(page);
      const dbData = await cameraDbModel.getAllDbCameras();

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
      throw error;
    }
  },
  getAllCamerasBySourceId: async (sourceId, page) => {
    try {
      const apiData = await cameraApiModel.getAllApiCamerasBySourceId(sourceId, page);
      const dbData = await cameraDbModel.getAllDbCamerasBySourceId(sourceId);
      console.log(apiData.totalItems);
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

module.exports = {
  cameraDbModel,
  cameraApiModel,
  camaraFullModel
};
