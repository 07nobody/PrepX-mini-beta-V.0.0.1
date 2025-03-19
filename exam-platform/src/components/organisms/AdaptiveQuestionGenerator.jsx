import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import useQuestionStore from '../../stores/questionStore';
import api from '../../utils/api';

const AdaptiveQuestionGenerator = ({ userId }) => {
  const { questions, setQuestions } = useQuestionStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/questions/adaptive?userId=${userId}`);
        setQuestions(response.data);
      } catch (error) {
        console.error('Error fetching adaptive questions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [userId, setQuestions]);

  const handleAnswer = async (questionId, answer) => {
    try {
      await api.post(`/questions/${questionId}/answer`, { answer });
      // Fetch new set of questions based on updated performance
      const response = await api.get(`/questions/adaptive?userId=${userId}`);
      setQuestions(response.data);
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  return (
    <div>
      <h1>Adaptive Question Generator</h1>
      {loading ? (
        <p>Loading questions...</p>
      ) : (
        questions.map((question) => (
          <div key={question.id}>
            <p>{question.text}</p>
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(question.id, option)}
              >
                {option}
              </button>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

AdaptiveQuestionGenerator.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default AdaptiveQuestionGenerator;
