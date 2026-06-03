const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

// Submit feedback
router.post('/', feedbackController.submitFeedback);

// Get feedback for a specific user
router.get('/user/:email', feedbackController.getUserFeedback);

// Get all feedback (Admin)
router.get('/all', feedbackController.getAllFeedback);

module.exports = router;
