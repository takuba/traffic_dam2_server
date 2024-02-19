const utm = require('utm');
const Camera = require('../models/Camera');

//Camera database model
const cameraDbModel = {
  getAllDbCameras: async () => {
    try {
      const results = await Camera.findAll();
      results.forEach(it => {
      }
      );
      return results;
    } catch (error) {
      throw error;
    }
  }, 
  getAllDbCamerasBySourceId: async (cameraId,sourceId) => {
    try {
      const cameras = await Camera.findAll({
        attributes: ['cameraId', 'cameraName', 'urlImage', 'latitude', 'longitude', 'sourceId','sourceName'],
        where: {
          cameraId: cameraId,
          sourceId: sourceId
        }
      });
      return cameras;
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
      //change lat and lon to decimal
      setTheLocationUtmToDecimal(apiData.cameras)
      //delete unnecessary atributes from the result 
      const filterData = apiData.cameras.map(({ road, kilometer, address, ...rest }) => rest);
      //join the result with the filtered data
      const mixedResults = {
        totalItems: apiData.totalItems,
        totalPages: apiData.totalPages,
        currentPage: apiData.currentPage,
        cameras: filterData,
      };
      //add new atribute to the camera
      getSourceNameByCameras(mixedResults.cameras);

      return mixedResults;
    } catch (error) {
      throw error;
    }
  },
  getAllApiCamerasBySourceId: async (cameraId,sourceId) => {
    try {
      const response = await fetch(`https://api.euskadi.eus/traffic/v1.0/cameras/${cameraId}/${sourceId}`);
      const apiData = await response.json();
      delete apiData.road;
      delete apiData.kilometer;
      delete apiData.address;
      setTheLocationUtmToDecimal([apiData])
      getSourceNameByCameras([apiData]);
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
  getAllCamerasBySourceId: async (cameraId,sourceId) => {
    try {
      const apiData = await cameraApiModel.getAllApiCamerasBySourceId(cameraId, sourceId);
      const dbData = await cameraDbModel.getAllDbCamerasBySourceId(cameraId,sourceId);
      const mixedCameras = dbData.concat(apiData);
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
      const newCamera = await Camera.create({
        cameraId: cameraId,
        sourceId: sourceId,
        cameraName: cameraName,
        urlImage: urlImage,
        latitude: latitude,
        longitude: longitude,
        sourceName:null
      });

      return newCamera;
    } catch (error) {
      console.log("error in addNewIncidence ", error);
      throw error;
    }

  },
  updateCamera : async(updatedCamera, cameraId) => {
    try {
      // Utiliza el método update para actualizar el registro
      const [numberOfUpdatedRows, updatedRows] = await Camera.update(updatedCamera, {
        where: {
          cameraId: cameraId
        }
      });
      if (numberOfUpdatedRows > 0) {
        return { numberOfUpdatedRows, updatedRows };
      } else {
        throw new Error('No se encontró ninguna cámara con el ID proporcionado.');
      }
    } catch (error) {
      // Maneja cualquier error
      console.log("error in updateCamera ", error);
      throw error;
    }

  }
};


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

//function that add new atribute to the array
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
module.exports = {
  cameraDbModel,
  cameraApiModel,
  camaraFullModel
};
