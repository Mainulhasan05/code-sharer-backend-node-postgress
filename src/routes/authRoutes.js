const router = require('express').Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middlewares/verifyToken');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/user', verifyToken, authController.getUser);