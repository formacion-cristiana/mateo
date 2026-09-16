import React, { useRef, useState, useEffect } from "react";

import html2pdf from "html2pdf.js";
import { normalizeQuestions } from "../utils/normalizeQuestions";
import { exportMarkdown } from "../utils/exportMarkdown";
import { prepareQuizQuestions } from "../utils/prepareQuizQuestions";
import { renderQuestion } from "../utils/renderQuestionForPrint";
import "../styles/PrintableQuiz.css";

function PrintableQuiz({ quiz, hideExportButton }) {
  const handleExportMarkdown = () => {
    exportMarkdown([quiz], `${quiz.title}.md`);
  };

  const printRef = useRef(null);

    useEffect(() => {
    if (printRef.current) {
      // scroll smoothly to quiz content on mount
      printRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

    
  const [exporting, setExporting] = useState(false);
  const [shuffleAnswers, setShuffleAnswers] = useState(true); // 🔀 default shuffled
  const pageTitle = document.title;



  // Normalize and prepare
  const normalized = normalizeQuestions(quiz.questions);
  const preparedQuestions = prepareQuizQuestions(normalized, shuffleAnswers);

  return (
    <div className={`quiz-container ${hideExportButton ? "printable-quiz-wrapper" : ""}`}>
      {!hideExportButton && (
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
          <button onClick={handleExportMarkdown}>Texto Simple</button>
          <label style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <input
              type="checkbox"
              checked={!shuffleAnswers} // ✅ checked means "ordered"
              onChange={(e) => setShuffleAnswers(!e.target.checked)}
            />
            Ordenar respuestas
          </label>
        </div>
      )}

      <div className="pdf-wrapper">
        <div ref={printRef} className="pdf-content">
          <h4 className="page-header">{pageTitle}</h4>
          <h1 className="quiz-title">{quiz.title}</h1>
          {quiz.comment && <h3 className="quiz-title">{quiz.comment}</h3>}
          {preparedQuestions.map((q, qIdx) => renderQuestion(q, qIdx))}
        </div>
      </div>
    </div>
  );
}

export default PrintableQuiz;
