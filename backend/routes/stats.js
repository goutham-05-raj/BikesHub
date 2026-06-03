const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const verifyToken = require('../middleware/authMiddleware');

// Get system stats (Admin only)
router.get('/admin', verifyToken, statsController.getAdminStats);

module.exports = router;
