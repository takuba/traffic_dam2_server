const mysql = require('mysql2');
const dbConfig = require('../dbConfig');

const connection = mysql.createConnection(dbConfig);

const flowMeterDbModel = {
    getAllDbflowMeter: async () => {
      try {
        const query = 'SELECT meterId, provinceId,sourceId, municipalityId, description, latitude, longitude, geometry FROM flowMeter';
        const [results] = await connection.promise().query(query);
        
        const newArray = results.map(objeto => ({
          ...objeto,
          geometry: objeto.geometry.map(point => [point.x, point.y])
        }));
        // console.log(newArray);

        const arrayTransformado = newArray.map(objeto => ({
          "type": "Feature",
          "properties": {
            "meterId": objeto.meterId,
            "sourceId": objeto.sourceId,
            "description": objeto.description,
            "provinceId": objeto.provinceId,
            "municipalityId": objeto.municipalityId,
            "latitude": objeto.latitude,
            "longitude": objeto.longitude
          },
          "geometry": {
            "type": "LineString",
            "coordinates": objeto.geometry
          }
        }));
        
        // console.log(newArray);
        return arrayTransformado;
      } catch (error) {
        throw error;
      }
    }, 
    getAllDbflowMeterByMeterId: async (meterId) => {
      try {
        const query = 'SELECT meterId, provinceId,sourceId, municipalityId, description, latitude, longitude, geometry  FROM flowMeter WHERE meterId = ?';
        const [results] = await connection.promise().query(query, [meterId]);
        return results;
      } catch (error) {
        throw error;
      }
    },
    getAllDbflowMeterById: async (meterId,sourceId) => {
      try {
        const query = 'SELECT meterId, provinceId,sourceId, municipalityId, description, latitude, longitude, geometry FROM flowMeter WHERE meterId = ? AND sourceId = ?';
        const [results] = await connection.promise().query(query, [meterId,sourceId]);
        return results;
      } catch (error) {
        throw error;
      }
    },
    getAllDbflowMeterByLocation: async (latitude,longitude) => {
      try {
        const query = 'SELECT meterId, provinceId,sourceId, municipalityId, description, latitude, longitude FROM flowMeter WHERE latitude = ? AND longitude = ?';
        const [results] = await connection.promise().query(query, [latitude,longitude]);
        return results;
      } catch (error) {
        throw error;
      }
    }
  };

  const flowMeterApiModel = {
    getAllApiflowMeters: async (page) => {
      try {
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
        return filterData;
      } catch (error) {
        throw error;
      }
    },
    getAllApiflowMeterByLocation: async (latitude, longitude, radius, page) => {
      try {
        const response = await fetch(`https://api.euskadi.eus/traffic/v1.0/meters/byLocation/${latitude}/${longitude}/${radius}?_page=${page}`);
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
        return filterData;
      } catch (error) {
        console.log("error in getAllApiflowMeterByLocation: ");
        throw error;
      }
    },
    getAllApiflowMetersByMeterId: async (meterId) => {
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
        return filteredData;
      } catch (error) {
        console.log("Erro in getAllApiflowMetersByMeterId: ", error);
        throw error;
      }
    }    
  }

  const flowMeterFullModel = {
    getAllMeters: async (page) => {
      try {
        const apiData = await flowMeterApiModel.getAllApiflowMeters(page);
        const dbData = await flowMeterDbModel.getAllDbflowMeter();
        console.log(dbData);
        //camera numbers in the db
        const itemLength = dbData.length;
        apiData.totalItems+=itemLength;
        //mixed api and db data
        const mixedCameras = dbData.concat(apiData.features);
  
        const mixedResult = {
          totalItems: apiData.totalItems,
          totalPages: apiData.totalPages,
          currentPage: apiData.currentPage,
          type: "FeatureCollection",
          features: mixedCameras,
        };
        const result = page == 1 ? mixedResult : apiData;
        return result;
      } catch (error) {
        throw error;
      }
    },
    getAllflowMetersByMeterId: async (meterId) => {
      try {
        const apiData = await flowMeterApiModel.getAllApiflowMetersByMeterId(meterId);
        console.log(apiData);
        
        return {features:[apiData]};
      } catch (error) {
        console.log("error en la api");
        //throw "NOT FOUND";
      }
      try {
        const dbData = await flowMeterDbModel.getAllDbflowMeterByMeterId(meterId);
        console.log(dbData);
        const newArray = dbData.map(objeto => ({
          ...objeto,
          geometry: objeto.geometry.map(point => [point.x, point.y])
        }));
        const arrayTransformado = newArray.map(objeto => ({
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
            "coordinates": objeto.geometry
          }
        }));
        const combinedObject = {features:[Object.assign({}, ...arrayTransformado)]};
        return combinedObject;
      } catch (error) {
        console.log("Error in getAllApiflowMetersByMeterId: ", error);
        throw error;
      }

      // 
    },
    addNewFlowMeter: async(meterId, provinceId, municipalityId, description, latitude, longitude, geometry) => {
      try {
        console.log(geometry);
        const numeroAleatorio = Math.floor(Math.random() * (90000) + 10000);

        meterId= numeroAleatorio;
        const query = 'INSERT INTO flowMeter ( meterId, provinceId, municipalityId, description, latitude, longitude, geometry) VALUES ( ?, ?, ?, ?, ?, ?, ST_GeomFromGeoJSON(?))';
        const [results] = await connection.promise().query(query, [meterId, provinceId, municipalityId, description, latitude, longitude, JSON.stringify(geometry)]);
        console.log(results);
        return results;
      } catch (error) {
        console.log("error in addNewFlowMeter ", error);
        throw error;
      }
  
    },
    updateFlowMeter : async(provinceId, municipalityId, description, latitude, longitude, geometry,meterId) => {
      try {
        const query = 'UPDATE flowMeter SET provinceId = ?, municipalityId = ?, description = ?, latitude = ?, longitude = ?, geometry = ST_GeomFromGeoJSON(?) WHERE meterId = ?';
        const [results] = await connection.promise().query(query, [provinceId, municipalityId, description, latitude, longitude, JSON.stringify(geometry),meterId]);
        return results;
      } catch (error) {
        console.log("error in addNewIncidence ", error);
        throw error;
      }
  
    }
  }

module.exports = {
    flowMeterDbModel,
    flowMeterApiModel,
    flowMeterFullModel
  };
  