const express = require('express');
const router = express.Router();
const bikesController = require('../controllers/bikesController');

router.get('/', bikesController.getBikes);
router.get('/:id', bikesController.getBike);

module.exports = router;