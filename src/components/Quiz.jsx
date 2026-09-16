import React from "react";
import MatchingQuestion from "./questions/MatchingQuestion";
import MultipleChoiceQuestion from "./questions/MultipleChoiceQuestion";
import OrderingQuestion from "./questions/OrderingQuestion";

import Result from "./Result";

import { useQuiz } from "../hooks/useQuiz";
import { formatAnswer } from "../utils/formatAnswer"; 
import { renderAnswerItem } from "../utils/renderAnswerItem"; 
import { scrollToElementBelowHeader } from "../utils/scrollUtils";
import { updatePageMeta } from "../utils/updatePageMeta";

import ReactMarkdown from 'react-markdown';
import "../styles/App.css";
import { useEffect, useRef, useState } from "react";


import ShowButtons from "../components/showButtons";

function Quiz({ quiz, onRestart }) {
  const {
    currentQuestion,
    userAnswers,
    setUserAnswers,
    handleAnswer,
    showFeedback,
    setShowFeedback,
    lastCorrectAnswer,
    isCorrectAnswer,
    isQuizComplete,
    resetQuiz,
    retryIncorrectOnly, 
    score,
    total,
    currentIndex, 
    setCurrentIndex,
    currentMaxIndex,
    setCurrentMaxIndex,
    navigationLocked,
  } = useQuiz(quiz);


  useEffect(() => {
    updatePageMeta(quiz.title, quiz.comment);
  }, [quiz.title, quiz.comment]); // ✅ listens for both changes


  // 🔹 Ref for question container
  const questionRef = useRef(null);

  // 🔹 Scroll to the question start when index changes

  useEffect(() => {
    scrollToElementBelowHeader(questionRef.current,10);
  }, [currentIndex]);

  if (isQuizComplete) {
    const hasIncorrect = userAnswers.some((entry) => !entry.isCorrect);
    return (
      <Result
        userAnswers={userAnswers}
        score={score}
        total={total}
        onRestart={resetQuiz}
        onRetryIncorrect={hasIncorrect ? retryIncorrectOnly : null}
      />
    );
  }

function goToNextQuestion(){

    if(!showFeedback && currentIndex===currentMaxIndex){
      setUserAnswers((prev) => [
      ...prev,
      {
        question: currentQuestion,
        userAnswer: "",
        isCorrect: false,
        correctAnswer:currentQuestion.correctAnswer,
      },
    ]);
    }
      setShowFeedback(false);

    if (currentIndex >= total - 1) {
      // Fake completion by skipping ahead
      setCurrentIndex(total); // this will trigger isQuizComplete to become true
    } else {
      if(currentIndex===currentMaxIndex){
      setCurrentMaxIndex((prev) => prev + 1);
      }
      setCurrentIndex((prev) => prev + 1);
    }


}
function goToPrevQuestion() {
    if (navigationLocked) return;
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
    setShowFeedback(false);
}

return (
  <div >
      <div ref={questionRef}>
            {/* Question navigation arrows */}
<div style={{
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  margin: "2rem 0 1rem",
}}>
  <button
    onClick={goToPrevQuestion}
    disabled={navigationLocked || currentIndex === 0}
    style={{ fontSize: "1.5rem", padding: "0.5rem 1rem" }}
  >
    ⬅
  </button>

  <div     style={{   display: "block", marginRight: "2rem",marginLeft: "2rem" }}
>
      <h3  style={{textAlign: "center"}}>[{currentQuestion.num+1}]</h3>
  </div>

<button
  onClick={goToNextQuestion}
  disabled={navigationLocked}
  style={{ fontSize: "1.5rem", padding: "0.5rem 1rem" }}
>
  ➡
</button>

</div>



    {currentQuestion.image && (
      <img
        src={import.meta.env.BASE_URL + currentQuestion.image}
        alt={currentQuestion.image}
        style={{
          maxWidth: "100%",
          height: "auto",
          marginBottom: "1rem",
          borderRadius: "10px",
        }}
      />
    )}


      <h3  style={{textAlign: "left"}}><ReactMarkdown>{currentQuestion.questionText}</ReactMarkdown></h3>
  </div>

    {currentQuestion.type === "matching" && (
      <MatchingQuestion question={currentQuestion} onSubmit={handleAnswer} />
    )}
    {currentQuestion.type === "multiple-choice" && (
      <MultipleChoiceQuestion question={currentQuestion} onSubmit={handleAnswer} />
    )}
    {currentQuestion.type === "ordering" && (
      <OrderingQuestion question={currentQuestion} onSubmit={handleAnswer} />
    )}




    {showFeedback && (
      <div
          style={{
              textAlign: "left",
              marginBottom: "1rem",
              padding: "1rem",
              borderRadius: "8px",
              backgroundColor: isCorrectAnswer ? "#e0f7e9" : "#ffe0e0",
              color: isCorrectAnswer ? "#2d8a4f" : "#a00000",
              border: `1px solid ${isCorrectAnswer ? "#2d8a4f" : "#a00000"}`,
              transition: "opacity 0.5s ease, transform 0.5s ease",
              transform: showFeedback ? "translateY(0)" : "translateY(-10px)",
            }}
      >
        {isCorrectAnswer ? (     "✅"        ) : 
        (
<div>
<div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              Respuesta Correcta: <br/><br/>
  {(Array.isArray(lastCorrectAnswer) ? lastCorrectAnswer : [lastCorrectAnswer]).map((item, idx) => (
    <div
      key={idx}
      className="item-box-result"
      style={{ width: "100%", padding: "0.5rem", borderRadius: "6px" }}
    >
      {currentQuestion.type === "ordering" && `(${idx + 1}) `}
      {renderAnswerItem(item)}
    </div>
  ))}
</div>
</div>
        )}
        <br />
      </div>
    )}


{currentQuestion && (
  <ShowButtons
    key={currentQuestion.num}
    tip={currentQuestion.tip}
    reflect={currentQuestion.reflect}
  />
)}

    {/* Question navigation arrows */}
<div style={{
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  margin: "2rem 0 1rem",
}}>
  <button
    onClick={goToPrevQuestion}
    disabled={navigationLocked || currentIndex === 0}
    style={{ fontSize: "1.5rem", padding: "0.5rem 1rem" }}
  >
    ⬅
  </button>

  <div     style={{   display: "block", marginRight: "2rem",marginLeft: "2rem" }}
>
   {currentIndex + 1} de {total}
  </div>

<button
  onClick={goToNextQuestion}
  disabled={navigationLocked}
  style={{ fontSize: "1.5rem", padding: "0.5rem 1rem" }}
>
  ➡
</button>

</div>

  </div>
);

}

export default Quiz;
