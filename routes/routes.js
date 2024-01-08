const express = require ('express')
const router = express.Router();
const camarasController = require('../controllers/camarasController');
const validationMiddleware = require('../middlewares/tokenValidator');
const usuariosControllers = require('../controllers/userAuth');


router.get('/camaras', validationMiddleware,camarasController.getAllCamaras);
router.post('/login', usuariosControllers.login);
router.post('/registro',usuariosControllers.register);


module.exports = router;