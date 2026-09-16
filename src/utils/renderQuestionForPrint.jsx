// utils/renderQuestionForPrint.js

export const checkboxStyle = {
  border: "1px solid #000",
  padding: "0.5rem",
  borderRadius: "4px",
  display: "inline-block",
  width: "fit-content",
  maxWidth: "100%",
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  marginBottom: "0.25rem",
};

export const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "0.5rem",
  tableLayout: "fixed",
};

export const tdStyle = {
  border: "1px solid #666",
  padding: "6px 4px",
  minHeight: "30px",
  textAlign: "center",
  verticalAlign: "middle",
  fontSize: "10pt",
  wordBreak: "break-word",
  whiteSpace: "normal",
};

/**
 * Render a single question for printable view (returns JSX)
 * @param {Object} q - prepared question (shuffledItems / shuffledColumns already set)
 * @param {number} qIdx - question index
 */
export function renderQuestion(q, qIdx) {
  return (
    <div key={qIdx} className="question-block">
      <h3 className="question-title">{qIdx + 1}. {q.questionText}</h3>

      {/* Multiple choice or ordering */}
      {["multiple-choice", "ordering"].includes(q.type) && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {q.shuffledItems?.map((opt, i) => (
            <div key={i} style={checkboxStyle}>{opt}</div>
          ))}
        </div>
      )}

      {/* Matching */}
{q.type === "matching" && q.shuffledColumns && (
  <table style={tableStyle}>
    <thead>
      <tr>
        {q.columns?.map((header, hIdx) => (
          <th
            key={hIdx}
            style={{
              ...tdStyle,
              fontWeight: "bold",
              backgroundColor: "#f5f5f5",
            }}
          >
            {header}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {q.shuffledColumns[0].map((_, rowIdx) => (
        <tr key={rowIdx}>
          {q.shuffledColumns.map((col, cIdx) => (
            <td key={cIdx} style={tdStyle}>{col[rowIdx]}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
)}

    </div>
  );
}
