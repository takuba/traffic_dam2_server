const express = require ('express')
const router = express.Router();
const camarasController = require('../controllers/camarasController');
const validationMiddleware = require('../middlewares/tokenValidator');


router.get('/camaras', validationMiddleware,camarasController.getAllCamaras);
router.get('/login');
router.post('/registro');


module.exports = router;