const express = require('express');
const router = express.Router();
const { generateQuestions, listQuestions, updateQuestion, validateQuestion, reportIssue, reviewQuestion } = require('../controllers/questionController');
const { authenticate } = require('../middleware/authMiddleware');
const { cacheMiddleware } = require('../middleware/cacheMiddleware');
const { paginateMiddleware } = require('../middleware/paginateMiddleware');
const { indexMiddleware } = require('../middleware/indexMiddleware');

// Generate new questions
router.post('/generate', authenticate, generateQuestions);

// List questions with pagination and caching
router.get('/', authenticate, cacheMiddleware, paginateMiddleware, listQuestions);

// Update a question
router.put('/:id', authenticate, updateQuestion);

// Validate a question
router.post('/validate', authenticate, validateQuestion);

// Report an issue with a question
router.post('/report', authenticate, reportIssue);

// Review and approve a question
router.post('/review', authenticate, reviewQuestion);

module.exports = router;
