// components/showButtons.jsx
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function ShowButtons({ key, tip, reflect }) {
  const [showTip, setShowTip] = useState(false);
  const [showReflect, setShowReflect] = useState(false);

  if (!tip && !reflect) return null;

  const containerStyle = {
    marginTop: "1rem",
    maxWidth: "600px",
    marginLeft: "auto",
    marginRight: "auto",
  };

  const buttonBaseStyle = {
    flex: "1 1 48%",
    padding: "0.5rem 1rem",
    border: "1px solid #ccc",
    borderRadius: "6px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontWeight: "bold",
  };

  const tipButtonStyle = (active) => ({
    ...buttonBaseStyle,
    backgroundColor: active ? "#f0f8ff" : "#f9f9f9",
    borderColor: active ? "#add8e6" : "#ccc",
  });

  const reflectButtonStyle = (active) => ({
    ...buttonBaseStyle,
    backgroundColor: active ? "#fff8dc" : "#f9f9f9",
    borderColor: active ? "#f0e68c" : "#ccc",
  });

  const contentStyle = {
    boxSizing: "border-box",
    backgroundColor: "#f0f8ff",
    border: "1px solid #add8e6",
    borderRadius: "6px",
    padding: "0.75rem",
    marginTop: "0.5rem",
    color: "#333",
    width: "100%",
    maxWidth: "100%",
         textAlign:"left"
  };

  const reflectContentStyle = {
    ...contentStyle,
    backgroundColor: "#fff8dc",
    border: "1px solid #f0e68c",
  };

  return (
    <div style={containerStyle}>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        {tip && (
          <button
            onClick={() => setShowTip(!showTip)}
            style={tipButtonStyle(showTip)}
          >
            {showTip ? "▼" : "▶"} Info
          </button>
        )}
        {reflect && (
          <button
            onClick={() => setShowReflect(!showReflect)}
            style={reflectButtonStyle(showReflect)}
          >
            {showReflect ? "▼" : "▶"} Reflexión
            
          </button>
        )}
      </div>

      {showTip && (
        <div style={contentStyle}>
          <ReactMarkdown>{tip}</ReactMarkdown>
        </div>
      )}

      {showReflect && (
        <div style={reflectContentStyle}>
          <ReactMarkdown>{reflect}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
