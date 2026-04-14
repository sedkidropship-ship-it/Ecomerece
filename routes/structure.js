const express = require('express');
const router = express.Router();
const structureController = require('../controllers/structureController');
const { authMiddleware: auth } = require('../middleware/auth');

// Public route
router.get('/', structureController.getStructure);

// Protected routes
router.put('/', auth, structureController.updateStructure);

module.exports = router;
