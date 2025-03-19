const express = require('express');
const router = express.Router();
const { getExams, getExamById, startExam, submitExam, getUserProgress } = require('../controllers/examController');
const { authenticate } = require('../middleware/authMiddleware');
const { verifySEBClient } = require('../middleware/sebMiddleware');

// List available exams
router.get('/', authenticate, getExams);

// Get specific exam
router.get('/:id', authenticate, getExamById);

// Start an exam session
router.post('/:id/start', authenticate, verifySEBClient, startExam);

// Submit exam answers
router.post('/:id/submit', authenticate, verifySEBClient, submitExam);

// Get user progress
router.get('/me/progress', authenticate, getUserProgress);

module.exports = router;
