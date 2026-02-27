const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviewsController');

router.get('/bike/:bikeId', reviewsController.getReviews);
router.post('/bike/:bikeId', reviewsController.addReview);

module.exports = router;