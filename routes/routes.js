const express = require ('express')
const router = express.Router();
const camerasController = require('../controllers/camerasController');
const validationMiddleware = require('../middlewares/tokenValidator');
const userController = require('../controllers/userAuth');

//user
router.post('/login', userController.login);
router.post('/register',userController.register);

//Cameras
// router.get('/camaras', validationMiddleware,camerasController.getAllCameras);
 router.get('/cameras', camerasController.getAllCameras);
router.get('/cameras_db', camerasController.getAllDbCameras);

router.get('/cameras_db/:id', camerasController.getAllDbCamerasById);
router.get('/cameras_db/:latitude/:longitude', camerasController.getAllDbCamerasByLocation);

router.get('/cameras_api/:page', camerasController.getAllApiCameras);
router.get('/cameras_api/:latitude/:longitude/:radius/:page', camerasController.getAllApiCamerasByLocation);
router.get('/cameras_api/:sourceId/:page', camerasController.getAllApiCamerasBySourceId);



module.exports = router;