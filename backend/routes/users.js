const express = require('express');
const router = express.Router();
const { registerUser, getUser, getAllUsers } = require('../controllers/usersController');

// POST /api/users/register  — called from frontend after Firebase Auth signup
router.post('/register', registerUser);

// GET /api/users            — list all (admin use)
router.get('/', getAllUsers);

// GET /api/users/:uid       — get single user profile
router.get('/:uid', getUser);

module.exports = router;
