const express = require ('express')
const router = express.Router();
const camerasController = require('../controllers/camerasController');
const validationMiddleware = require('../middlewares/tokenValidator');
const userController = require('../controllers/userController');
const incidencesController = require('../controllers/incidencesController');
const flowMeterController = require('../controllers/flowMeterController');
// const flowsController = require('../controllers/flowController');

//user
router.post('/login', userController.getUserByEmail);
router.post('/register',userController.register);
router.post('/fav',userController.uploadUserFav);
//router.get('/fav/:user_id/:fav_id/:sourceId',userController.getUserFav);
router.get('/fav/:user_id/:type', userController.getUserDbFav);
router.get('/user/:user_id', userController.getUserInfo);

router.delete('/fav/:user_id/:type/:fav_id/:sourceId', userController.deleteUserFav);

//Cameras
router.get('/cameras_db', camerasController.getAllDbCameras);
router.get('/cameras_db/:cameraId/:sourceId', camerasController.getAllDbCamerasBySourceId);

router.get('/cameras_api/:page', camerasController.getAllApiCameras);
router.get('/cameras_api/:cameraId/:sourceId', camerasController.getAllApiCamerasBySourceId);

router.get('/cameras/:page', camerasController.getAllCameras);
router.get('/cameras/:cameraId/:sourceId', camerasController.getAllCamerasBySourceId);
router.post('/cameras', camerasController.addNewCamera);
router.put('/cameras/:cameraId', camerasController.updateCamera);
router.delete('/cameras/:cameraId', camerasController.deleteCamerasBySourceId);

//incidencias
router.get('/incidences_db', incidencesController.getAllDbIncidences);
router.get('/incidences/:page', incidencesController.getAllIncidencesByPage);
router.get('/incidences/:incidenceId/:sourceId', incidencesController.getAllIncidencesById);
router.post('/incidences', incidencesController.addNewIncidence);
router.delete('/incidences/:incidenceId', incidencesController.deleteIncidenceBySourceId);


//Sensores
 router.get('/flowMeter/:page', flowMeterController.getAllMeters);
router.get('/flowMeter/meterId/:meterId/', flowMeterController.getAllflowMetersByMeterId);
router.post('/flowMeter', flowMeterController.addNewFlowMeter);
router.delete('/flowMeter/:meterId', flowMeterController.deleteMeterBySourceId);


module.exports = router;