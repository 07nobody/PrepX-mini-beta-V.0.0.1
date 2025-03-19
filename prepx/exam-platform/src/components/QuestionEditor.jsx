import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const QuestionEditor = ({ initialQuestion, onSave, onCancel, categories, difficultyLevels }) => {
  const [question, setQuestion] = useState(initialQuestion || { text: '', options: [], correctAnswer: '', category: '', difficulty: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialQuestion) {
      setQuestion(initialQuestion);
    }
  }, [initialQuestion]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuestion((prevQuestion) => ({
      ...prevQuestion,
      [name]: value,
    }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...question.options];
    newOptions[index] = value;
    setQuestion((prevQuestion) => ({
      ...prevQuestion,
      options: newOptions,
    }));
  };

  const handleAddOption = () => {
    setQuestion((prevQuestion) => ({
      ...prevQuestion,
      options: [...prevQuestion.options, ''],
    }));
  };

  const handleRemoveOption = (index) => {
    const newOptions = question.options.filter((_, i) => i !== index);
    setQuestion((prevQuestion) => ({
      ...prevQuestion,
      options: newOptions,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!question.text) newErrors.text = 'Question text is required';
    if (question.options.length < 2) newErrors.options = 'At least two options are required';
    if (!question.correctAnswer) newErrors.correctAnswer = 'Correct answer is required';
    if (!question.category) newErrors.category = 'Category is required';
    if (!question.difficulty) newErrors.difficulty = 'Difficulty level is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSave(question);
    }
  };

  return (
    <div>
      <h1>Question Editor</h1>
      <div>
        <label>
          Question Text:
          <input type="text" name="text" value={question.text} onChange={handleInputChange} />
          {errors.text && <span>{errors.text}</span>}
        </label>
      </div>
      <div>
        <label>
          Options:
          {question.options.map((option, index) => (
            <div key={index}>
              <input type="text" value={option} onChange={(e) => handleOptionChange(index, e.target.value)} />
              <button type="button" onClick={() => handleRemoveOption(index)}>Remove</button>
            </div>
          ))}
          <button type="button" onClick={handleAddOption}>Add Option</button>
          {errors.options && <span>{errors.options}</span>}
        </label>
      </div>
      <div>
        <label>
          Correct Answer:
          <input type="text" name="correctAnswer" value={question.correctAnswer} onChange={handleInputChange} />
          {errors.correctAnswer && <span>{errors.correctAnswer}</span>}
        </label>
      </div>
      <div>
        <label>
          Category:
          <select name="category" value={question.category} onChange={handleInputChange}>
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          {errors.category && <span>{errors.category}</span>}
        </label>
      </div>
      <div>
        <label>
          Difficulty Level:
          <select name="difficulty" value={question.difficulty} onChange={handleInputChange}>
            <option value="">Select Difficulty</option>
            {difficultyLevels.map((level) => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
          {errors.difficulty && <span>{errors.difficulty}</span>}
        </label>
      </div>
      <div>
        <button type="button" onClick={handleSubmit}>Save</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

QuestionEditor.propTypes = {
  initialQuestion: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  difficultyLevels: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default QuestionEditor;
