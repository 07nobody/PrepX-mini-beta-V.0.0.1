import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Profiler } from 'react';
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

  const handleAnswerChange = useCallback((questionId, answer) => {
    setAnswer(questionId, answer);
  }, [setAnswer]);

  const handleSubmit = useCallback(() => {
    onComplete(answers);
  }, [onComplete, answers]);

  const handleNextQuestion = useCallback(() => {
    setCurrentQuestionIndex((prevIndex) => Math.min(prevIndex + 1, questions.length - 1));
  }, [questions.length]);

  const handlePreviousQuestion = useCallback(() => {
    setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  }, []);

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
    <Profiler id="ExamInterface" onRender={onRenderCallback}>
      <div>
        <h1>Exam Interface</h1>
        <p>Exam ID: {examId}</p>
        <p>Time Remaining: {Math.floor(timeRemaining / 60)}:{timeRemaining % 60}</p>
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
    </Profiler>
  );
};

ExamInterface.propTypes = {
  examId: PropTypes.string.isRequired,
  timeLimit: PropTypes.number.isRequired,
  onComplete: PropTypes.func.isRequired,
  onTimeExpired: PropTypes.func.isRequired,
};

export default React.memo(ExamInterface);
