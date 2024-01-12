const express = require ('express')
const router = express.Router();
const camerasController = require('../controllers/camerasController');
const validationMiddleware = require('../middlewares/tokenValidator');
const userController = require('../controllers/userController');
const incidencesController = require('../controllers/incidencesController');

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


module.exports = router;