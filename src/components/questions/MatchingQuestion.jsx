import React, { useState, useEffect } from "react";
import "../../styles/MatchingQuestion.css";
import { prepareMatchingQuestion } from "../../utils/prepareMatchingQuestion";
import SmartTable from "../SmartTable"; // import SmartTable

const COLORS = ["lightblue", "#fee9be", "#CBC3E3", "#9CAF88", "#FED8B1", "#9bcdff"];

function MatchingQuestion({ question, onSubmit }) {
  const [columns, setColumns] = useState([]);
  const [rowHeaders, setRowHeaders] = useState([]);
  const [options, setOptions] = useState([]);
  const [selections, setSelections] = useState([]);
  const [sets, setSets] = useState([]);
  const [effectiveAnswer, setEffectiveAnswer] = useState([]);

  useEffect(() => {
    const { headers, rowHeaders, rows } = prepareMatchingQuestion(question, true, true);
    setColumns(headers);
    setRowHeaders(rowHeaders);
    setOptions(rows[0] ? rows[0].map((_, i) => rows.map(r => r[i])) : []);
    setSelections(Array(headers.length).fill(null));
    setSets([]);
    setEffectiveAnswer(question.correctAnswer);
  }, [question]);

  const handleSelect = (colIndex, item) => {
    setSelections(prev => {
      const updated = [...prev];
      updated[colIndex] = updated[colIndex] === item ? null : item;
      return updated;
    });
  };

  useEffect(() => {
    if (selections.length === 0 || !selections.every(item => item !== null)) return;

    const currentSelections = [...selections];
    setSets(prevSets => {
      const filteredSets = prevSets.filter(
        set => !set.items.some(item => currentSelections.includes(item))
      );
      const usedColors = filteredSets.map(s => s.color);
      const availableColor = COLORS.find(c => !usedColors.includes(c));
      if (!availableColor) return filteredSets;
      return [...filteredSets, { items: currentSelections, color: availableColor }];
    });

    setSelections(Array(selections.length).fill(null));
  }, [selections]);

  const getButtonColor = item => {
    const set = sets.find(s => s.items.includes(item));
    return set ? set.color : "white";
  };

  const handleSubmit = () => {
    const userGroups = sets.map(s => s.items);
    const isCorrect = arraysEqualIgnoringOrder(userGroups, effectiveAnswer);
    onSubmit(userGroups, isCorrect, effectiveAnswer);
  };

  const renderCellContent = item => {
    if (typeof item === "string" && /\.(png|jpe?g|gif|svg)$/.test(item)) {
      return (
        <img
          src={`${import.meta.env.BASE_URL}/images/${item}`}
          alt=""
          style={{ maxWidth: "80px", maxHeight: "60px", display: "block", margin: "0 auto" }}
        />
      );
    }
    if (typeof item === "string") {
      return item.split(" ").map((word, i) => <span key={i} className="word">{word} </span>);
    }
    return item;
  };

  const renderGrid = () => (
    <>
      {columns.length > 0 && (
        <>
          {rowHeaders.length > 0 && <div className="matching-cell header" />}
          {columns.map((header, i) => (
            <div className="matching-cell header" key={`header-${i}`}>
              {renderCellContent(header)}
            </div>
          ))}
        </>
      )}

      {options[0]?.map((_, rowIndex) => (
        <React.Fragment key={`row-${rowIndex}`}>
          {rowHeaders.length > 0 && (
            <div className="matching-cell header" key={`rowheader-${rowIndex}`}>
              {renderCellContent(rowHeaders[rowIndex])}
            </div>
          )}
          {options.map((colItems, colIndex) => {
            const item = colItems[rowIndex];
            if (!item) return <div className="matching-cell" key={`cell-${rowIndex}-${colIndex}`} />;
            const selected = selections[colIndex] === item;
            const bg = selected ? "#d0ebff" : getButtonColor(item);
            return (
              <div className="matching-cell" key={`cell-${rowIndex}-${colIndex}`}>
                <button
                  onClick={() => handleSelect(colIndex, item)}
                  className={`matching-btn${selected ? " selected" : ""}`}
                  style={{ backgroundColor: bg }}
                >
                  {renderCellContent(item)}
                </button>
              </div>
            );
          })}
        </React.Fragment>
      ))}
    </>
  );

  const colSpan = columns.length + (rowHeaders.length > 0 ? 1 : 0);

  if (!effectiveAnswer.length) return <div>Error: Matching question data is invalid.</div>;

  return (
    <div>
      {columns.length > 4 ? (
        <div className="matching-grid-wrapper">
          <div className="matching-grid" style={{ gridTemplateColumns: `repeat(${colSpan}, min-content)` }}>
            {renderGrid()}
          </div>
        </div>
      ) : (
        <SmartTable
          columns={columns}
          rowHeaders={rowHeaders}
          options={options}
          selections={selections}
          onSelect={handleSelect}
          getButtonColor={getButtonColor}
          renderCellContent={renderCellContent}
        />
      )}

      <div className="submit-wrapper">
        <button
          onClick={handleSubmit}
          className="submit-btn"
          disabled={sets.length !== effectiveAnswer.length}
        >
          Responder
        </button>
      </div>
    </div>
  );
}

function arraysEqualIgnoringOrder(arr1, arr2) {
  const normalize = arr => arr.map(sub => [...sub].sort().join("|")).sort();
  const norm1 = normalize(arr1);
  const norm2 = normalize(arr2);
  return norm1.length === norm2.length && norm1.every((v, i) => v === norm2[i]);
}

export default MatchingQuestion;
