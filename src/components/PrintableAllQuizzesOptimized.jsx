// components/PrintableAllQuizzesOptimized.jsx
import React, { useRef, useState, useEffect } from "react";
import html2pdf from "html2pdf.js";
import { exportMarkdown } from "../utils/exportMarkdown";
import { prepareQuizQuestions } from "../utils/prepareQuizQuestions";
import { renderQuestion } from "../utils/renderQuestionForPrint";
import "../styles/PrintableQuiz.css";

function PrintableAllQuizzesOptimized({ quizzes, printRef }) {
  const [exporting, setExporting] = useState(false);
  const [shuffleAnswers, setShuffleAnswers] = useState(true); // 🔀 default shuffled

  useEffect(() => {
    if (printRef.current) {
      // scroll smoothly to quiz content on mount
      printRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);
  const pageTitle = document.title;
  return (
    <div>
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <button onClick={() => exportMarkdown(quizzes, pageTitle + ".md")}>
          Texto Simple
        </button>
        <label style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
          <input
            type="checkbox"
            checked={!shuffleAnswers} // ✅ checked = ordered
            onChange={(e) => setShuffleAnswers(!e.target.checked)}
          />
          Ordenar respuestas
        </label>
      </div>
  <div className="pdf-wrapper">
      <div ref={printRef} className="pdf-content" >
        {quizzes.map((quiz, idx) => {
          const preparedQuestions = prepareQuizQuestions(quiz.questions, shuffleAnswers);
          return (
                       <div
      key={quiz.title || idx}
      className="printable-quiz-wrapper"
      style={{
        breakBefore: idx > 0 ? "page" : "auto",   // modern
        pageBreakBefore: idx > 0 ? "always" : "auto" // fallback
      }}
    >
          <h4 className="page-header">{pageTitle}</h4>
          <h1 className="quiz-title">{quiz.title}</h1>
          {quiz.comment && <h3 className="quiz-title">{quiz.comment}</h3>}
          {preparedQuestions.map((q, qIdx) => renderQuestion(q, qIdx))}
        </div>
          );
        })}
      </div>
    </div>
  </div>
  );
}

export default PrintableAllQuizzesOptimized;
