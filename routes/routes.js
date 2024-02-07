const express = require ('express')
const router = express.Router();
const camerasController = require('../controllers/camerasController');
const validationMiddleware = require('../middlewares/tokenValidator');
const userController = require('../controllers/userController');
const incidencesController = require('../controllers/incidencesController');
const flowMeterController = require('../controllers/flowMeterController');
const flowsController = require('../controllers/flowController');

//user
router.post('/login', userController.login);
router.post('/register',userController.register);
router.post('/fav',userController.uploadUserFav);
router.get('/fav/:user_id/:fav_id/:sourceId',userController.getUserFav);
router.get('/fav/:user_id/:type', userController.getUserDbFav);
router.get('/user/:user_id', userController.getUserInfo);

router.delete('/fav/:user_id/:type/:fav_id/:sourceId', userController.deleteUserFav);

//Cameras
// router.get('/camaras', validationMiddleware,camerasController.getAllCameras);
router.get('/cameras_db', validationMiddleware,camerasController.getAllDbCameras);
router.get('/cameras_db/:cameraId/:sourceId', camerasController.getAllDbCamerasBySourceId);
router.get('/cameras_db/:latitude/:longitude', camerasController.getAllDbCamerasByLocation);

router.get('/cameras_api/:page', camerasController.getAllApiCameras);
router.get('/cameras_api/:latitude/:longitude/:radius/:page', camerasController.getAllApiCamerasByLocation);
router.get('/cameras_api/:cameraId/:sourceId', camerasController.getAllApiCamerasBySourceId);

router.get('/cameras/:page', camerasController.getAllCameras);
router.get('/cameras/:latitude/:longitude/:radius/:page', camerasController.getAllCamerasByLocation);
router.get('/cameras/:cameraId/:sourceId', camerasController.getAllCamerasBySourceId);
router.post('/cameras', camerasController.addNewCamera);
router.put('/cameras/:cameraId', camerasController.updateCamera);

//Incidences
router.get('/incidences_api/:page', incidencesController.getAllApiIncidences);
router.get('/incidences_api/:year/:month/:latitude/:longitude/:radius/:page', incidencesController.getAllApiIncidencesByLocation);
// router.get('/incidences_api/:year/:page', incidencesController.getAllApiIncidencesByYear);
router.get('/incidences_api/:incidenceId/:sourceId', incidencesController.getAllApiIncidencesById);

router.get('/incidences_db', incidencesController.getAllDbIncidences);
router.get('/incidences_db/:year', incidencesController.getAllDbIncidencesByYear);
router.get('/incidences_db/:year/:month/:latitude/:longitude', incidencesController.getAllDbIncidencesByLocation);
router.get('/incidences_db/:incidenceId/:sourceId', incidencesController.getAllDbIncidencesById);


router.get('/incidences/:page', incidencesController.getAllIncidencesByPage);
//router.get('/incidences/:year/:page', incidencesController.getAllIncidencesByYear);
router.get('/incidences/:year/:month/:latitude/:longitude/:radius/:page', incidencesController.getAllIncidencesByLocation);
router.get('/incidences/:incidenceId/:sourceId', incidencesController.getAllIncidencesById);
router.post('/incidences', incidencesController.addNewIncidence);
router.put('/incidences/:incidenceId', incidencesController.updateIncidence);

//flows meter
router.get('/flowMeter_db', flowMeterController.getAllDbflowMeter);
router.get('/flowMeter_db/:meterId', flowMeterController.getAllDbflowMeterByMeterId);
//router.get('/flowMeter_db/:latitude/:longitude', flowMeterController.getAllDbflowMeterByLocation);
router.get('/flowMeter_db/:meterId/:sourceId', flowMeterController.getAllDbflowMeterById);

router.get('/flowMeter_api/:page', flowMeterController.getAllApiflowMeter);
router.get('/flowMeter_api/:latitude/:longitude/:radius/:page', flowMeterController.getAllApiflowMeterByLocation);
router.get('/flowMeter_api/meterId/:meterId/', flowMeterController.getAllApiflowMetersByMeterId);

router.get('/flowMeter/:page', flowMeterController.getAllMeters);
router.get('/flowMeter/meterId/:meterId/', flowMeterController.getAllflowMetersByMeterId);
router.post('/flowMeter', flowMeterController.addNewFlowMeter);
router.put('/flowMeter/:meterId', flowMeterController.updateFlowMeter);

//flows
router.get('/flows_db/:year/:month/:day', flowsController.getAllDbflowByDate);
router.get('/flows_db/:year/:month/:day/:meterId', flowsController.getAllDbflowByMeterId);

router.get('/flows_api/:year/:month/:day/:page', flowsController.getAllApiflowByDate);
router.get('/flows_api/:year/:month/:day/:meterId/:page', flowsController.getAllApiflowByMeterId);

router.get('/flows/:year/:month/:day/:page', flowsController.getAllFlowsByDate);
router.get('/flows/:year/:month/:day/:meterId/:page', flowsController.getAllFlowsByMeterId);
router.post('/flows', flowsController.addNewFlow);
router.put('/flows/:meterId', flowsController.updateFlow);


module.exports = router;