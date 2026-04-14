const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');
const { authMiddleware: auth } = require('../middleware/auth');

// Public route for storefront checkout
router.get('/', deliveryController.getDeliveryData);

// Admin routes
router.put('/', auth, deliveryController.updateDeliveryData);

module.exports = router;
