const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware'); 

<<<<<<< HEAD
=======
// Rota para criar usuário
router.post('/', userController.createUser);

>>>>>>> ae5d75931aafda4f3e2dbe28a8cd2af1ea7ba0be
// Rota para obter o perfil do usuário autenticado
router.get('/profile', authMiddleware, userController.getProfile);

// Rota para atualizar o perfil do usuário autenticado
router.put('/profile', authMiddleware, userController.updateProfile);

// Rota para excluir a conta do usuário autenticado
router.delete('/profile', authMiddleware, userController.deleteAccount);

module.exports = router;