const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware'); 

// Rota para obter o perfil do usuário autenticado
router.get('/profile', authMiddleware, userController.getProfile);

// Rota para atualizar o perfil do usuário autenticado
router.put('/profile', authMiddleware, userController.updateProfile);

// Rota para excluir a conta do usuário autenticado
router.delete('/profile', authMiddleware, userController.deleteAccount);

module.exports = router;