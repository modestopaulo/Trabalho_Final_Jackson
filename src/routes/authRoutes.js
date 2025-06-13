const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const userController = require('../controllers/userController');

// Rota de registro
router.post('/register', authController.register);

// Rota de login
router.post('/login', authController.login);

// Rota para obter o perfil do usuário autenticado
router.get('/profile', authMiddleware, userController.getProfile);

module.exports = router;