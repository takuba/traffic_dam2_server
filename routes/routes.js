const express = require ('express')
const router = express.Router();
const camerasController = require('../controllers/camerasController');
const validationMiddleware = require('../middlewares/tokenValidator');
const userController = require('../controllers/userController');
const incidencesController = require('../controllers/incidencesController');
const flowMeterController = require('../controllers/flowMeterController');

//user
router.post('/login', userController.login);
router.post('/register',userController.register);

//Cameras
// router.get('/camaras', validationMiddleware,camerasController.getAllCameras);
router.get('/cameras_db', camerasController.getAllDbCameras);
router.get('/cameras_db/:sourceId', camerasController.getAllDbCamerasBySourceId);
router.get('/cameras_db/:latitude/:longitude', camerasController.getAllDbCamerasByLocation);

router.get('/cameras_api/:page', camerasController.getAllApiCameras);
router.get('/cameras_api/:latitude/:longitude/:radius/:page', camerasController.getAllApiCamerasByLocation);
router.get('/cameras_api/:sourceId/:page', camerasController.getAllApiCamerasBySourceId);

router.get('/cameras/:page', camerasController.getAllCameras);
router.get('/cameras/:latitude/:longitude/:radius/:page', camerasController.getAllCamerasByLocation);
router.get('/cameras/:sourceId/:page', camerasController.getAllCamerasBySourceId);
router.post('/cameras', camerasController.addNewCamera);
router.put('/cameras/:cameraId', camerasController.updateCamera);

//Incidences
router.get('/incidences_api/:page', incidencesController.getAllApiIncidences);
router.get('/incidences_api/:year/:month/:latitude/:longitude/:radius/:page', incidencesController.getAllApiIncidencesByLocation);
router.get('/incidences_api/:year/:page', incidencesController.getAllApiIncidencesByYear);

router.get('/incidences_db', incidencesController.getAllDbIncidences);
router.get('/incidences_db/:year', incidencesController.getAllDbIncidencesByYear);
router.get('/incidences_db/:year/:month/:latitude/:longitude', incidencesController.getAllDbIncidencesByLocation);

router.get('/incidences/:page', incidencesController.getAllIncidencesByPage);
router.get('/incidences/:year/:page', incidencesController.getAllIncidencesByYear);
router.get('/incidences/:year/:month/:latitude/:longitude/:radius/:page', incidencesController.getAllIncidencesByLocation);
router.post('/incidences', incidencesController.addNewIncidence);
router.put('/incidences/:incidenceId', incidencesController.updateIncidence);

//flows meter
router.get('/flowMeter_db', flowMeterController.getAllDbflowMeter);
router.get('/flowMeter_db/:meterId', flowMeterController.getAllDbflowMeterByMeterId);
router.get('/flowMeter_db/:latitude/:longitude', flowMeterController.getAllDbflowMeterByLocation);

router.get('/flowMeter_api/:page', flowMeterController.getAllApiflowMeter);
router.get('/flowMeter_api/:latitude/:longitude/:radius/:page', flowMeterController.getAllApiflowMeterByLocation);
router.get('/flowMeter_api/meterId/:meterId/', flowMeterController.getAllApiflowMetersByMeterId);

router.get('/flowMeter/:page', flowMeterController.getAllMeters);
router.get('/flowMeter/meterId/:meterId/', flowMeterController.getAllflowMetersByMeterId);
router.post('/flowMeter', flowMeterController.addNewFlowMeter);
router.put('/flowMeter/:meterId', flowMeterController.updateFlowMeter);


module.exports = router;