const express = require('express');
const router = express.Router();
const { generateQuestions, listQuestions, updateQuestion, validateQuestion } = require('../controllers/questionController');
const { authenticate } = require('../middleware/authMiddleware');

// Generate new questions
router.post('/generate', authenticate, generateQuestions);

// List questions
router.get('/', authenticate, listQuestions);

// Update a question
router.put('/:id', authenticate, updateQuestion);

// Validate a question
router.post('/validate', authenticate, validateQuestion);

module.exports = router;
