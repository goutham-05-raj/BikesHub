const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviewsController');

const verifyToken = require('../middleware/authMiddleware');

router.get('/bike/:bikeId', reviewsController.getReviews);
router.get('/all', reviewsController.getAllReviews);
router.post('/bike/:bikeId', verifyToken, reviewsController.addReview);

module.exports = router;