import React, { useState, useEffect } from "react";

function MultipleChoiceQuestion({ question, onSubmit }) {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  // ⬅️ Reset internal state when question changes
  useEffect(() => {
    setSelectedOptions([]);
    setSubmitted(false);
  }, [question]);

  const toggleOption = (optionText) => {
    setSelectedOptions((prev) =>
      prev.includes(optionText)
        ? prev.filter((opt) => opt !== optionText)
        : [...prev, optionText]
    );
  };

  const handleSubmit = () => {
    const correctAnswers = question.answerOptions
      .filter((opt) => opt.isCorrect)
      .map((opt) => opt.answerText)
      .sort();

    const userAnswers = [...selectedOptions].sort();

    const isCorrect =
      JSON.stringify(userAnswers) === JSON.stringify(correctAnswers);

    onSubmit(userAnswers, isCorrect, correctAnswers);
    setSubmitted(true);
  };

  return (
    <div>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {question.answerOptions.map((option, index) => (
          <li key={index} style={{ marginBottom: "0.5rem" }}>
            <button
              onClick={() => toggleOption(option.answerText)}
              disabled={submitted}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: selectedOptions.includes(option.answerText)
                  ? "#74c0fc"
                  : "#f0f0f0",
                color: "#000",
                border: "1px solid #ccc",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              {option.answerText}
            </button>
          </li>
        ))}
      </ul>
      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={selectedOptions.length === 0}
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Responder
        </button>
      )}
    </div>
  );
}

export default MultipleChoiceQuestion;
