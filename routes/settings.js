/**
 * MAISON ÉLITE — Settings Routes
 * GET  /api/settings/theme       → public (frontend loads on init)
 * PUT  /api/settings/theme       → admin only
 * POST /api/settings/theme/logo  → admin only (logo upload)
 */

const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const settingsController = require('../controllers/settingsController');

// Public — used by frontend ThemeProvider on every page load
router.get('/theme', settingsController.getTheme);

// Protected — admin dashboard only
router.put('/theme', authMiddleware, settingsController.updateTheme);
router.post('/theme/logo', authMiddleware, settingsController.uploadLogo);
router.post('/theme/hero', authMiddleware, settingsController.uploadHero);

// Tracking Pixels settings
router.get('/tracking', settingsController.getTracking);
router.put('/tracking', authMiddleware, settingsController.updateTracking);

module.exports = router;
