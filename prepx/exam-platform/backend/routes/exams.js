const express = require('express');
const router = express.Router();
const { getExams, getExamById, startExam, submitExam, getUserProgress } = require('../controllers/examController');
const { authenticate } = require('../middleware/authMiddleware');

// List available exams
router.get('/', authenticate, getExams);

// Get specific exam
router.get('/:id', authenticate, getExamById);

// Start an exam session
router.post('/:id/start', authenticate, startExam);

// Submit exam answers
router.post('/:id/submit', authenticate, submitExam);

// Get user progress
router.get('/me/progress', authenticate, getUserProgress);

module.exports = router;
