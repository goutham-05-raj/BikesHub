const express = require('express');
const router = express.Router();
const { submitDeal } = require('../controllers/dealsController');

// POST /api/deals
router.post('/', submitDeal);

module.exports = router;
