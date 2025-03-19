import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Profiler } from 'react';
import create from 'zustand';

const useQuestionStore = create((set) => ({
  question: { text: '', options: [], correctAnswer: '', category: '', difficulty: '' },
  setQuestion: (newQuestion) => set({ question: newQuestion }),
}));

const QuestionEditor = ({ initialQuestion, onSave, onCancel, categories, difficultyLevels }) => {
  const { question, setQuestion } = useQuestionStore();
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialQuestion) {
      setQuestion(initialQuestion);
    }
  }, [initialQuestion, setQuestion]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setQuestion((prevQuestion) => ({
      ...prevQuestion,
      [name]: value,
    }));
  }, [setQuestion]);

  const handleOptionChange = useCallback((index, value) => {
    const newOptions = [...question.options];
    newOptions[index] = value;
    setQuestion((prevQuestion) => ({
      ...prevQuestion,
      options: newOptions,
    }));
  }, [question.options, setQuestion]);

  const handleAddOption = useCallback(() => {
    setQuestion((prevQuestion) => ({
      ...prevQuestion,
      options: [...prevQuestion.options, ''],
    }));
  }, [setQuestion]);

  const handleRemoveOption = useCallback((index) => {
    const newOptions = question.options.filter((_, i) => i !== index);
    setQuestion((prevQuestion) => ({
      ...prevQuestion,
      options: newOptions,
    }));
  }, [question.options, setQuestion]);

  const validate = useCallback(() => {
    const newErrors = {};
    if (!question.text) newErrors.text = 'Question text is required';
    if (question.options.length < 2) newErrors.options = 'At least two options are required';
    if (!question.correctAnswer) newErrors.correctAnswer = 'Correct answer is required';
    if (!question.category) newErrors.category = 'Category is required';
    if (!question.difficulty) newErrors.difficulty = 'Difficulty level is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [question]);

  const handleSubmit = useCallback(() => {
    if (validate()) {
      onSave(question);
    }
  }, [validate, onSave, question]);

  const onRenderCallback = (
    id, // the "id" prop of the Profiler tree that has just committed
    phase, // either "mount" (if the tree just mounted) or "update" (if it re-rendered)
    actualDuration, // time spent rendering the committed update
    baseDuration, // estimated time to render the entire subtree without memoization
    startTime, // when React began rendering this update
    commitTime, // when React committed this update
    interactions // the Set of interactions belonging to this update
  ) => {
    console.log({ id, phase, actualDuration, baseDuration, startTime, commitTime, interactions });
  };

  return (
    <Profiler id="QuestionEditor" onRender={onRenderCallback}>
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
    </Profiler>
  );
};

QuestionEditor.propTypes = {
  initialQuestion: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  difficultyLevels: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default React.memo(QuestionEditor);
