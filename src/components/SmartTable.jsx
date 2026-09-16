/* components/questions/SmartTable.jsx */
import React from "react";
import "../styles/Table.css";
import "../styles/MatchingQuestion.css";

function SmartTable({ columns, rowHeaders, options, selections, onSelect, getButtonColor, renderCellContent }) {
  const rows = options[0]?.length ?? 0;

  return (
    <div className="smarttable-wrapper">
      <div
        className="smarttable"
        style={{ "--smart-cols": columns.length + (rowHeaders.length > 0 ? 1 : 0) }}
      >
        {/* Header row */}
        <div className="smarttable-row header">
          {rowHeaders.length > 0 && <div className="smarttable-cell rowhead-blank" />}
          {columns.map((header, i) => (
            <div key={i} className="smarttable-cell">{header}</div>
          ))}
        </div>

        {/* Data rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="smarttable-row">
            {rowHeaders.length > 0 && (
              <div className="smarttable-cell rowhead">{rowHeaders[rowIndex]}</div>
            )}

            {options.map((colItems, colIndex) => {
              const item = colItems[rowIndex];
              const selected = selections[colIndex] === item;
              const bg = selected ? "#d0ebff" : getButtonColor(item);

              return (
                <div key={colIndex} className="smarttable-cell">
                  {item ? (
                    <button
                      type="button"
                      onClick={() => onSelect(colIndex, item)}
                      className={`cell-btn${selected ? " selected" : ""}`}
                      style={{ backgroundColor: bg }}
                    >
                      {renderCellContent(item)}
                    </button>
                  ) : (
                    <div className="cell-empty" />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SmartTable;
