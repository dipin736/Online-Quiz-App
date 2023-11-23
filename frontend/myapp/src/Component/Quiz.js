import React, { useState, useEffect, useCallback } from 'react';
import './QuizComponent.css';
import { useAuth } from '../Auth/AuthContext';

const QuizComponent = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState(''); 
  const [score, setScore] = useState(0);
  const [remainingTime, setRemainingTime] = useState(60); 
  const { user } = useAuth();
  const token = user ? user.token : null;
  const [sendScoreLoading, setSendScoreLoading] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('http://127.0.0.1:3030/api/questions/');
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, []);
  const sendScoreEmail = async () => {
    console.log('User:', user);
  
    if (!user || !user.email) {
      alert('Invalid user or email');
      return;
    }
  
    console.log('Sending email to:', user.email);
  
    setSendScoreLoading(true);
  
    try {
      const response = await fetch('http://127.0.0.1:3030/api/send-score-email/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({
          to: user.email,
          score: `${score}/${questions.length}`,
        }),
      });
      console.log('Response:', response); 
      if (response.ok) {
        alert('Quiz score sent successfully!');
      } else {
        console.error('Failed to send quiz score:', response.status, response.statusText);
        alert('Failed to send quiz score. Please try again.');
      }
    } catch (error) {
      console.error('Error sending quiz score:', error);
      alert('Error sending quiz score. Please try again.');
    } finally {
      setSendScoreLoading(false);
    }
  };
  

  const handleAnswerSubmit = useCallback(async () => {
    if (questions.length === 0) {
      alert('No questions available.');
      return;
    }

    const currentQuestion = questions[currentQuestionIndex];

    if (userAnswer === '') {
      alert('Please select an option before submitting.');
      return;
    }

    const isCorrect = userAnswer === currentQuestion.correct_answer;

    setScore((prevScore) => (isCorrect ? prevScore + 1 : prevScore));

    try {
      const response = await fetch('http://127.0.0.1:3030/api/user-answers/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({
          question: currentQuestion.id,
          selected_option: userAnswer,
          is_correct: isCorrect,
          score: isCorrect ? 1 : 0,
        }),
      });

      if (!response.ok) {
        console.error('Failed to save user answer:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error saving user answer:', error);
    }

    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    setUserAnswer('');
    setRemainingTime(60);
  }, [currentQuestionIndex, userAnswer, questions, token]);

  useEffect(() => {
    let interval;

    const handleTimerTick = () => {
      setRemainingTime((prevTime) => {
        if (currentQuestionIndex === questions.length) {
          clearInterval(interval);
          return prevTime;
        }

        if (prevTime === 0) {
          handleAnswerSubmit();
          clearInterval(interval);
          return 60;
        }

        return prevTime - 1;
      });
    };

    handleTimerTick();

    interval = setInterval(handleTimerTick, 1000);

    return () => clearInterval(interval);
  }, [currentQuestionIndex, handleAnswerSubmit, questions.length]);

  if (questions.length === 0) {
    return <p className='final-score m-4 p-5'>No questions available.</p>;
  }

  if (currentQuestionIndex === questions.length) {
    return (
      <div className="quiz-completed mt-5">
        <h2>Quiz Completed</h2>
        <p>Your final score is: {score}/{questions.length}</p>
        <button
          className="send-score-button"
          onClick={sendScoreEmail}
          disabled={sendScoreLoading}
        >
          {sendScoreLoading ? 'Sending...' : 'Send Score to Email'}
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  return (
    <div className="quiz-container mt-5 p-3 ">
      {currentQuestionIndex === questions.length ? (
        <div className="quiz-completed" style={{ 'color': 'red' }}>
          <h2>Quiz Completed</h2>
          <p>Your final score is: {score}</p>
        </div>
      ) : (
        <div className="question-container">
          <h2 className="question-text">{currentQuestion.text}</h2>
          <form className="form">
            <ul className="options-list">
              {currentQuestion.options.map((option) => (
                <li key={option} className="option-item">
                  <label className="option-label">
                    <input
                      type="radio"
                      name="answerOption"
                      value={option}
                      checked={userAnswer === option}
                      onChange={() => setUserAnswer(option)}
                    />
                    {option}
                  </label>
                </li>
              ))}
            </ul>
            <button type="button" onClick={handleAnswerSubmit} className="submit-button">
              Submit Answer
            </button>
          <p className="timer mt-4">Time Remaining: {remainingTime} seconds</p>

          </form>
        </div>
      )}
    </div>
  );
};

export default QuizComponent;
