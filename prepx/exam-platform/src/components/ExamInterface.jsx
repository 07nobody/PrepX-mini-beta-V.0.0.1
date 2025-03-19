import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const ExamInterface = ({ examId, timeLimit, onComplete, onTimeExpired }) => {
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(timeLimit * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          onTimeExpired();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onTimeExpired]);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };

  const handleSubmit = () => {
    onComplete(answers);
  };

  return (
    <div>
      <h1>Exam Interface</h1>
      <p>Exam ID: {examId}</p>
      <p>Time Remaining: {Math.floor(timeRemaining / 60)}:{timeRemaining % 60}</p>
      {/* Render questions here */}
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
