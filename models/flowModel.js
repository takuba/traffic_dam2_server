const mysql = require('mysql2');
const dbConfig = require('../dbConfig');

const connection = mysql.createConnection(dbConfig);

const flowDbModel = {
    getAllDbflowByDate: async (year, month, day) => {
        try {
          console.log(year, month, day);
          const query = 'SELECT meterId, meterDate, timeRank, totalVehicles, speedIntervals, lengthIntervals FROM flows WHERE YEAR(meterDate) = ? AND MONTH(meterDate) = ? AND DAY(meterDate) = ?';
          const [results] = await connection.promise().query(query, [year, month, day]);
          return results;
        } catch (error) {
          console.log(error);
          throw error;
        }
      },
      getAllDbflowByMeterId: async (year, month, day, meterId) => {
        try {
          const query = 'SELECT meterId, meterDate, timeRank, totalVehicles, speedIntervals, lengthIntervals FROM flows WHERE YEAR(meterDate) = ? AND MONTH(meterDate) = ? AND DAY(meterDate) = ? AND meterId = ?';
          const [results] = await connection.promise().query(query, [year, month, day, meterId]);
          return results;
        } catch (error) {
          console.log("error in getAllApiIncidencesByLocation: ",error);
          throw error;
        }
      }
}

const flowApiModel = {
  getAllApiflowByDate: async (year, month, day, page) => {
    try {
      const response = await fetch(`https://api.euskadi.eus/traffic/v1.0/flows/byDate/${year}/${month}/${day}?_page=${page}`);
      const apiData = await response.json();
      return apiData;
    } catch (error) {
      throw error;
    }
  },
  getAllApiflowByMeterId: async (year, month, day, meterId, page) => {
    try {
      const response = await fetch(`https://api.euskadi.eus/traffic/v1.0/flows/byDate/${year}/${month}/${day}/byMeter/${meterId}?_page=${page}`);
      const apiData = await response.json();

      return apiData;
    } catch (error) {
      throw error;
    }
  }
}

const flowFullModel = {
  getAllFlowsByDate: async (year, month, day, page) => {
    try {
      const apiData = await flowApiModel.getAllApiflowByDate(year, month, day, page);
      const dbData = await flowDbModel.getAllDbflowByDate(year, month, day);

      //camera numbers in the db
      const itemLength = dbData.length;
      apiData.totalItems+=itemLength;
      //mixed api and db data
      const mixedCameras = dbData.concat(apiData.flows);
      const mixedResult = {
        totalItems: apiData.totalItems,
        totalPages: apiData.totalPages,
        currentPage: apiData.currentPage,
        flows: mixedCameras,
      };
      const result = page == 1 ? mixedResult : apiData;
      return result;
    } catch (error) {
      throw error;
    }
  },
  getAllFlowsByMeterId: async (year, month, day, meterId, page) => {
    try {
      const apiData = await flowApiModel.getAllApiflowByMeterId(year, month, day, meterId, page);
      const dbData = await flowDbModel.getAllDbflowByMeterId(year, month, day, meterId);

      //camera numbers in the db
      const itemLength = dbData.length;
      apiData.totalItems+=itemLength;
      //mixed api and db data
      const mixedCameras = dbData.concat(apiData.flows);
      const mixedResult = {
        totalItems: apiData.totalItems,
        totalPages: apiData.totalPages,
        currentPage: apiData.currentPage,
        flows: mixedCameras,
      };
      const result = page == 1 ? mixedResult : apiData;
      return result;
    } catch (error) {
      throw error;
    }
  },
  addNewFlow: async(meterDate, timeRank, totalVehicles, speedIntervals, lengthIntervals) => {
    try {
      const numeroAleatorio = Math.floor(Math.random() * (90000) + 10000);
      meterId= numeroAleatorio;
      const query = 'INSERT INTO flows ( meterId, meterDate, timeRank, totalVehicles, speedIntervals, lengthIntervals) VALUES ( ?, ?, ?, ?, ?, ?)';
      const [results] = await connection.promise().query(query, [meterId, meterDate, timeRank, totalVehicles, speedIntervals, lengthIntervals]);
      return results;
    } catch (error) {
      console.log("error in addNewIncidence ", error);
      throw error;
    }

  },
  updateFlow : async(updatedFlow, meterId) => {
    try {
      const query = 'UPDATE flows SET ? WHERE meterId = ?';
      const [results] = await connection.promise().query(query, [updatedFlow, meterId]);
      return results;
    } catch (error) {
      console.log("error in addNewIncidence ", error);
      throw error;
    }

  }
}

module.exports = {
    flowDbModel,
    flowApiModel,
    flowFullModel
  };
  