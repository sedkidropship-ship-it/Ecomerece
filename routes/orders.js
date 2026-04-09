/**
 * Order Routes
 */
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authMiddleware } = require('../middleware/auth');

// Public route — place order (COD)
router.post('/', orderController.createOrder);

// Admin-only routes
router.get('/', authMiddleware, orderController.getOrders);
router.get('/stats/summary', authMiddleware, orderController.getStats);
router.get('/:id', authMiddleware, orderController.getOrder);
router.patch('/:id/status', authMiddleware, orderController.updateOrderStatus);
router.delete('/:id', authMiddleware, orderController.deleteOrder);

module.exports = router;
