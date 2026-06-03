const express = require('express');
const router = express.Router();
const { submitMessage, getMessages } = require('../controllers/messagesController');

// POST /api/messages - Submit a message
router.post('/', submitMessage);

// GET /api/messages - Get all messages (Admin only in real world)
router.get('/', getMessages);

module.exports = router;
