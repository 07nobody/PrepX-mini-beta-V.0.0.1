const express = require('express');
const router = express.Router();
const { getUserProgress } = require('../controllers/userController');
const { authenticate } = require('../middleware/authMiddleware');

// Get user progress
router.get('/me/progress', authenticate, getUserProgress);

module.exports = router;
