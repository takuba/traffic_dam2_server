const mysql = require('mysql2');
const dbConfig = require('../dbConfig');

const connection = mysql.createConnection(dbConfig);

//DB models
const incidencesDbModel = {
  getAllDbIncidences: async () => {
    try {
      const query = 'SELECT incidenceId, sourceId, incidenceType, autonomousRegion, province, cause, startDate,	latitude,	longitude, incidenceLevel, direction FROM incidences';
      const [results] = await connection.promise().query(query);
      return results;
    } catch (error) {
      throw error;
    }
  },
  getAllDbIncidencesById: async (incidenceId, sourceId) => {
    try {
      const query = 'SELECT * FROM incidences WHERE incidenceId = ? AND sourceId = ?';
      const [results] = await connection.promise().query(query, [incidenceId, sourceId]);
      return results;
    } catch (error) {
      console.log("error in getAllApiIncidencesByLocation: ",error);
      throw error;
    }
  },
  getAllDbIncidencesByYear: async (year) => {
    try {
      const query = 'SELECT incidenceId, sourceId, incidenceType, autonomousRegion, province, cause, startDate,	latitude,	longitude, incidenceLevel, direction FROM incidences WHERE YEAR(startDate) = ?';
      const [results] = await connection.promise().query(query, [year]);
      return results;
    } catch (error) {
      console.log("error in getAllDbIncidencesByYear: ",error);
      throw error;
    }
  },
  getAllDbIncidencesByLocation: async (year, month, latitude, longitude) => {
    try {
      const query = 'SELECT incidenceId, sourceId, incidenceType, autonomousRegion, province, cause, startDate, latitude, longitude, incidenceLevel, direction FROM incidences WHERE YEAR(startDate) = ? AND MONTH(startDate) = ? AND latitude = ? AND longitude = ?';
      const [results] = await connection.promise().query(query, [year, month, latitude, longitude]);
      return results;
    } catch (error) {
      console.log("error in getAllApiIncidencesByLocation: ",error);
      throw error;
    }
  }
}

//Api models
const incidencesApiModel = {
    getAllApiIncidences: async (page) => {
        try {
          const response = await fetch(`https://api.euskadi.eus/traffic/v1.0/incidences?_page=${page}`);
          const apiData = await response.json();
          const filterData = apiData.incidences.map(({ pkStart, pkEnd, road,carRegistration, ...rest }) => rest);
          const mixedResults = {
            totalItems: apiData.totalItems,
            totalPages: apiData.totalPages,
            currentPage: apiData.currentPage,
            incidences: filterData,
          };
    
          return mixedResults;
        } catch (error) {
          throw error;
        }
      },
      getAllApiIncidencesById: async (id,sourceId) => {
        try {
          const response = await fetch(`https://api.euskadi.eus/traffic/v1.0/incidences/${id}/${sourceId}`);
          const apiData = await response.json();    
          return apiData;
        } catch (error) {
          throw error;
        }
      },
      getAllApiIncidencesByLocation: async (year, month, latitude, longitude, radius, page) => {
        try {
          const response = await fetch(`https://api.euskadi.eus/traffic/v1.0/incidences/byMonth/${year}/${month}/byLocation/${latitude}/${longitude}/${radius}?_page=${page}`);
          const apiData = await response.json();
          const filterData = apiData.incidences.map(({ pkStart, pkEnd, road,carRegistration, ...rest }) => rest);
          const mixedResults = {
            totalItems: apiData.totalItems,
            totalPages: apiData.totalPages,
            currentPage: apiData.currentPage,
            incidences: filterData,
          };
    
          return mixedResults;
        } catch (error) {
          throw error;
        }
      },
      getAllApiIncidencesByYear: async (year, page) => {
        try {
          const response = await fetch(`https://api.euskadi.eus/traffic/v1.0/incidences/byYear/${year}?_page=${page}`);
          const apiData = await response.json();
          const filterData = apiData.incidences.map(({ pkStart, pkEnd, road,carRegistration, ...rest }) => rest);
          const mixedResults = {
            totalItems: apiData.totalItems,
            totalPages: apiData.totalPages,
            currentPage: apiData.currentPage,
            incidences: filterData,
          };
    
          return mixedResults;
        } catch (error) {
          throw error;
        }
      }
}

//This method is to get all Incidences from DB and Api together
const incidencesFullModel = {
  getAllIncidencesByPage: async (page) => {
    try {
      const apiData = await incidencesApiModel.getAllApiIncidences(page);
      const dbData = await incidencesDbModel.getAllDbIncidences();

      //Incidences numbers in the db
      const itemLength = dbData.length;
      apiData.totalItems+=itemLength
      //mixed api and db data
      const mixedIncidences = dbData.concat(apiData.incidences);

      const mixedResult = {
        totalItems: apiData.totalItems,
        totalPages: apiData.totalPages,
        currentPage: apiData.currentPage,
        incidences: mixedIncidences,
      };
      const result = page == 1 ? mixedResult : apiData;
      return result;
    } catch (error) {
      throw error;
    }
  },
  getAllIncidencesById: async (id, sourceId) => {
    let apiData, dbData;
    try {
      apiData = await incidencesApiModel.getAllApiIncidencesById(id, sourceId);
    } catch (apiError) {
      console.error("Error in API call:", apiError);
    }
  
    try {
      dbData = await incidencesDbModel.getAllDbIncidencesById(id, sourceId);
    } catch (dbError) {
      console.error("Error in DB call:", dbError);
    }

    const mixedResultDb = {
      incidences: dbData.concat(apiData),
    };
    const mixedResultDb2 = {
      incidences: dbData
    };
    const mixedCameras = apiData ? mixedResultDb : mixedResultDb2;
  
    return mixedCameras;
  },
  getAllIncidencesByYear: async (year, page) => {
    try {
      const apiData = await incidencesApiModel.getAllApiIncidences(year,page);
      const dbData = await incidencesDbModel.getAllDbIncidencesByYear(year);

      //Incidences numbers in the db
      const itemLength = dbData.length;
      apiData.totalItems+=itemLength
      //mixed api and db data
      const mixedIncidences = dbData.concat(apiData.incidences);

      const mixedResult = {
        totalItems: apiData.totalItems,
        totalPages: apiData.totalPages,
        currentPage: apiData.currentPage,
        incidences: mixedIncidences,
      };
      const result = page == 1 ? mixedResult : apiData;
      return result;
    } catch (error) {
      throw error;
    }
  },
  getAllIncidencesByLocation: async (year, month, latitude, longitude, radius, page) => {
    try {
      const apiData = await incidencesApiModel.getAllApiIncidencesByLocation(year, month, latitude, longitude, radius, page);
      const dbData = await incidencesDbModel.getAllDbIncidencesByLocation(year, month, latitude, longitude);

      //Incidences numbers in the db
      const itemLength = dbData.length;
      apiData.totalItems+=itemLength
      //mixed api and db data
      const mixedIncidences = dbData.concat(apiData.incidences);

      const mixedResult = {
        totalItems: apiData.totalItems,
        totalPages: apiData.totalPages,
        currentPage: apiData.currentPage,
        incidences: mixedIncidences,
      };
      const result = page == 1 ? mixedResult : apiData;
      return result;
    } catch (error) {
      throw error;
    }
  },
  addNewIncidence: async(incidenceId, sourceId, incidenceType, autonomousRegion, province, cause, startDate,	latitude,	longitude, incidenceLevel, direction) => {
    try {
      const query = 'INSERT INTO incidences ( incidenceId, sourceId, incidenceType, autonomousRegion, province, cause, startDate,	latitude,	longitude, incidenceLevel, direction) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
      const [results] = await connection.promise().query(query, [incidenceId, sourceId, incidenceType, autonomousRegion, province, cause, startDate,	latitude,	longitude, incidenceLevel, direction]);
      return results;
    } catch (error) {
      console.log("error in addNewIncidence ", error);
      throw error;
    }

  },
  updateIncidence : async(updatedIncidence, incidenceId) => {
    try {
      const query = 'UPDATE incidences SET ? WHERE incidenceId = ?';
      const [results] = await connection.promise().query(query, [updatedIncidence, incidenceId]);
      return results;
    } catch (error) {
      console.log("error in addNewIncidence ", error);
      throw error;
    }

  }
}

module.exports = {
    incidencesDbModel,
    incidencesApiModel,
    incidencesFullModel
  };
  