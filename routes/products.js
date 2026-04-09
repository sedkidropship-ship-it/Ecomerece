/**
 * Product Routes
 */
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authMiddleware } = require('../middleware/auth');

// Public routes
router.get('/', productController.getProducts);
router.get('/categories/list', productController.getCategories);
router.get('/:id', productController.getProduct);

// Admin-only routes
router.post('/', authMiddleware, productController.createProduct);
router.put('/:id', authMiddleware, productController.updateProduct);
router.delete('/:id', authMiddleware, productController.deleteProduct);

module.exports = router;
