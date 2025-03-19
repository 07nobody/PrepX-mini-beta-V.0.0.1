import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import useExamStore from '../../stores/examStore';

const ExamInterface = ({ examId, timeLimit, onComplete, onTimeExpired }) => {
  const { currentExam, setCurrentExam, answers, setAnswer, timeRemaining, decrementTime } = useExamStore();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      decrementTime();
      if (timeRemaining <= 1) {
        clearInterval(timer);
        onTimeExpired();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [decrementTime, onTimeExpired, timeRemaining]);

  useEffect(() => {
    // Fetch questions from API
    const fetchQuestions = async () => {
      const response = await fetch(`/api/v1/exams/${examId}`);
      const data = await response.json();
      setQuestions(data.questions);
      setCurrentExam(data);
    };

    fetchQuestions();
  }, [examId, setCurrentExam]);

  const handleAnswerChange = (questionId, answer) => {
    setAnswer(questionId, answer);
  };

  const handleSubmit = () => {
    onComplete(answers);
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => Math.min(prevIndex + 1, questions.length - 1));
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  return (
    <div>
      <h1>Exam Interface</h1>
      <p>Exam ID: {examId}</p>
      <p>Time Remaining: {Math.floor(timeRemaining / 60)}:{timeRemaining % 60}</p>
      <div>
        <h2>Instructions for Safe Exam Browser (SEB)</h2>
        <p>Please ensure you have Safe Exam Browser (SEB) installed on your device before starting the exam.</p>
        <p>Download SEB from <a href="https://safeexambrowser.org/download_en.html" target="_blank" rel="noopener noreferrer">here</a>.</p>
        <p>Once SEB is installed, click the link below to start the exam in SEB:</p>
        <a href={`/seb-config/${examId}`} target="_blank" rel="noopener noreferrer">Start Exam in SEB</a>
      </div>
      {questions.length > 0 && (
        <div>
          <p>{questions[currentQuestionIndex].text}</p>
          {questions[currentQuestionIndex].options.map((option, index) => (
            <div key={index}>
              <input
                type="radio"
                name={`question-${questions[currentQuestionIndex].id}`}
                value={option}
                checked={answers[questions[currentQuestionIndex].id] === option}
                onChange={() => handleAnswerChange(questions[currentQuestionIndex].id, option)}
              />
              <label>{option}</label>
            </div>
          ))}
        </div>
      )}
      <button onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}>Previous</button>
      <button onClick={handleNextQuestion} disabled={currentQuestionIndex === questions.length - 1}>Next</button>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

ExamInterface.propTypes = {
  examId: PropTypes.string.isRequired,
  timeLimit: PropTypes.number.isRequired,
  onComplete: PropTypes.func.isRequired,
  onTimeExpired: PropTypes.func.isRequired,
};

export default ExamInterface;
