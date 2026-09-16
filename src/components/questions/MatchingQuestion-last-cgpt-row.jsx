import React, { useState, useEffect } from "react";
import "../../styles/MatchingQuestion.css";
import { shuffleArray } from "../../utils/shuffleArray";

const COLORS = ["lightblue", "#fee9be", "#CBC3E3", "#9CAF88", "#FED8B1", "#9bcdff"];

function MatchingQuestion({ question, onSubmit }) {
  const [columns, setColumns] = useState([]);
  const [rowHeaders, setRowHeaders] = useState([]);
  const [options, setOptions] = useState([]);
  const [selections, setSelections] = useState([]);
  const [sets, setSets] = useState([]);

  const matchBy = question.matchBy === "row" ? "row" : "column";

  useEffect(() => {
    const correctAnswer = question.correctAnswer;
    if (!correctAnswer || correctAnswer.length === 0) return;

    const rowCount = correctAnswer.length;
    const colCount = correctAnswer[0].length;

    const columnHeaders = Array.isArray(question.columns) && question.columns.length === colCount ? question.columns : Array(colCount).fill("");
    const rowHeadings = Array.isArray(question.rowHeaders) && question.rowHeaders.length === rowCount ? question.rowHeaders : Array(rowCount).fill("");

    setColumns(columnHeaders);
    setRowHeaders(rowHeadings);

    let transposed;
    if (matchBy === "column") {
      transposed = Array.from({ length: colCount }, (_, colIndex) => {
        return [...new Set(correctAnswer.map(row => row[colIndex]))];
      });
    } else {
      transposed = Array.from({ length: rowCount }, (_, rowIndex) => {
        return [...new Set(correctAnswer[rowIndex])];
      });
    }

    setOptions(transposed.map(col => shuffleArray(col)));
    setSelections(Array(transposed.length).fill(null));
    setSets([]);
  }, [question]);

  const handleSelect = (colIndex, item) => {
    setSelections(prev => {
      const updated = [...prev];
      updated[colIndex] = updated[colIndex] === item ? null : item;
      return updated;
    });
  };

  useEffect(() => {
    if (selections.length === 0) return;
    const allSelected = selections.every(item => item !== null);
    if (!allSelected) return;

    const currentSelections = [...selections];

    setSets(prevSets => {
      const filteredSets = prevSets.filter(
        set => !set.items.some(item => currentSelections.includes(item))
      );

      const usedColors = filteredSets.map(s => s.color);
      const availableColor = COLORS.find(color => !usedColors.includes(color));
      if (!availableColor) return filteredSets;

      return [...filteredSets, { items: currentSelections, color: availableColor }];
    });

    setSelections(Array(selections.length).fill(null));
  }, [selections]);

  const getButtonColor = item => {
    const set = sets.find(set => set.items.includes(item));
    return set ? set.color : "white";
  };

  const handleSubmit = () => {
    const userGroups = sets.map(s => s.items);
    const isCorrect = arraysEqualIgnoringOrder(userGroups, question.correctAnswer);
    onSubmit(userGroups, isCorrect, question.correctAnswer);
  };

  return (
    <div className="matching-grid">
      {rowHeaders.length > 0 && <div className="matching-cell header" />}
      {columns.map((header, i) => (
        <div className="matching-cell header" key={`header-${i}`}>
          {header}
        </div>
      ))}

      {options[0] && options[0].map((_, rowIndex) => (
        <React.Fragment key={`row-${rowIndex}`}>
          {rowHeaders.length > 0 && (
            <div className="matching-cell header">{rowHeaders[rowIndex]}</div>
          )}

          {options.map((col, colIndex) => {
            const item = col[rowIndex];
            const selected = selections[colIndex] === item;
            const bg = selected ? "#d0ebff" : getButtonColor(item);

            return (
              <div className="matching-cell" key={`cell-${rowIndex}-${colIndex}`}>
                <button
                  onClick={() => handleSelect(colIndex, item)}
                  className={`matching-btn${selected ? " selected" : ""}`}
                  style={{ backgroundColor: bg }}
                >
                  {renderItem(item)}
                </button>
              </div>
            );
          })}
        </React.Fragment>
      ))}

      <div className="submit-wrapper" style={{ gridColumn: `span ${columns.length + (rowHeaders.length > 0 ? 1 : 0)}` }}>
        <button
          onClick={handleSubmit}
          className="submit-btn"
          disabled={sets.length !== (matchBy === "column" ? question.correctAnswer.length : question.correctAnswer[0].length)}
        >
          Responder
        </button>
      </div>
    </div>
  );
}

function renderItem(item) {
  if (typeof item === "string" && /\.(png|jpe?g|gif|svg)$/.test(item)) {
    return (
      <img
        src={`${import.meta.env.BASE_URL}/images/${item}`}
        alt=""
        style={{ maxWidth: "80px", maxHeight: "60px" }}
      />
    );
  }
  return item;
}

function arraysEqualIgnoringOrder(arr1, arr2) {
  const normalize = arr => arr.map(sub => [...sub].sort().join("|")).sort();
  const norm1 = normalize(arr1);
  const norm2 = normalize(arr2);
  return norm1.length === norm2.length && norm1.every((v, i) => v === norm2[i]);
}

export default MatchingQuestion;
