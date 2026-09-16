import React from "react";

function TrueFalseQuestion({ question, onAnswer }) {
  const handleClick = (value) => {
    const isCorrect = value === question.correctAnswer;
    onAnswer(value, isCorrect);
  };

  return (
    <div>
      <button onClick={() => handleClick(true)}>Verdadero</button>
      <button onClick={() => handleClick(false)}>Falso</button>
    </div>
  );
}

export default TrueFalseQuestion;
