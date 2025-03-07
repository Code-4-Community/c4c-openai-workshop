import React, { useState } from 'react';
import Question from './Question';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    // Here you would implement the logic to process the file
    // and generate questions. For now, we'll just show a placeholder message
    console.log('File uploaded:', file.name);

    // TO DO
    setQuestions([{
      text: "Question text here?",
      options: ["Option 1", "Option 2", "Option 3", "Option 4"],
      correctAnswer: "Option 1"
    }]);
  };

  const handleAnswerSelect = (questionIndex, answer) => {
    setUserAnswers({
      ...userAnswers,
      [questionIndex]: answer,
    });
  };

  const handleSubmit = () => {
    let correctCount = 0;
    questions.forEach((question, index) => {
      if (userAnswers[index] === question.correctAnswer) {
        correctCount++;
      }
    });
    setScore((correctCount / questions.length) * 100);
  };

  return (
    <div className="quiz-container">
      <div className="upload-section">
        <input
          type="file"
          onChange={handleFileUpload}
          accept=".txt,.pdf,.doc,.docx"
        />
      </div>

      {questions.length > 0 ? (
        <>
          <div className="questions-section">
            {questions.map((question, index) => (
              <Question
                key={index}
                question={question.text}
                options={question.options}
                correctAnswer={question.correctAnswer}
                selectedAnswer={userAnswers[index]}
                onAnswerSelect={(answer) => handleAnswerSelect(index, answer)}
              />
            ))}
          </div>

          <button
            className="submit-button"
            onClick={handleSubmit}
            disabled={Object.keys(userAnswers).length !== questions.length}
          >
            Submit Quiz
          </button>

          {score !== null && (
            <div className="score-section">
              <h2>Your Score: {score.toFixed(2)}%</h2>
            </div>
          )}
        </>
      ) : (
        <p>Please upload a document to generate quiz questions.</p>
      )}
    </div>
  );
};

export default Quiz; 