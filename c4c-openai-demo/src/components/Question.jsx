import React from 'react';

const Question = ({ question, options, correctAnswer, selectedAnswer, onAnswerSelect }) => {
  return (
    <div className="question-container">
      <h3>{question}</h3>
      <div className="options">
        {options.map((option, index) => (
          <label key={index} className="option">
            <input
              type="radio"
              name={question}
              value={option}
              checked={selectedAnswer === option}
              onChange={() => onAnswerSelect(option)}
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
};

export default Question; 