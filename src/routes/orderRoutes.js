const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const orderController = require('../controllers/orderController');

router.post('/', authMiddleware, orderController.createOrder);
router.get('/me', authMiddleware, orderController.getMyOrders);
router.get('/:id', authMiddleware, orderController.getOrderById);
router.delete('/:id', authMiddleware, orderController.deleteOrder);

module.exports = router;