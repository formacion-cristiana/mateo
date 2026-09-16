import React from "react";
import ReactMarkdown from "react-markdown";

export default function QuizRenderer({ questions }) {
  return (
    <>
      {questions.map((q, idx) => {
        // Determine items to display
        const displayItems =
          q.type === "ordering"
            ? q.shuffledItems || q.correctAnswer || []
            : q.answerOptions?.map((opt) => opt.answerText) || [];

        return (
          <div className="question-block" key={idx}>
            <h3 className="question-title">
              {idx + 1}. <ReactMarkdown>{q.questionText}</ReactMarkdown>
            </h3>

            {/* Multiple choice or ordering */}
            {["multiple-choice", "ordering"].includes(q.type) && displayItems.length > 0 && (
              <div className="flex-wrap">
                {displayItems.map((item, i) => (
                  <div key={i} className="item-box">
                    <input type="checkbox" disabled style={{ marginRight: "0.5rem" }} />
                    {item}
                  </div>
                ))}
              </div>
            )}

            {/* Matching */}
            {q.type === "matching" && q.shuffledColumns && (
  <table className="match-table">
    <thead>
      <tr>
        {q.columns?.map((col, cIdx) => (
          <th key={cIdx} className="match-th">{col}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {q.shuffledColumns[0].map((_, rIdx) => (
        <tr key={rIdx}>
          {q.shuffledColumns.map((col, cIdx) => (
            <td key={cIdx} className="match-td">{col[rIdx]}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
)}

          </div>
        );
      })}
    </>
  );
}
