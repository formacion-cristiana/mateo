import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import Toast from "./Toast";

import { formatAnswer } from "../utils/formatAnswer";
import { renderAnswerItem } from "../utils/renderAnswerItem";
import { scrollToElementBelowHeader } from "../utils/scrollUtils";
import { buildIncorrectAnswersMessage } from "../utils/buildIncorrectAnswersMessage";
import { whatsappNumber } from "../data/quizInfo";

import "../styles/App.css";

function Result({ userAnswers, score, total, onRestart, onRetryIncorrect }) {
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();
  const resultRef = useRef(null);

  // Scroll only on client
  useEffect(() => {
    if (typeof window !== "undefined") {
      scrollToElementBelowHeader(resultRef.current, 15);
    }
  }, []);

  const goToMainMenu = () => navigate("/");

  const sendToWhatsApp = () => {
    if (typeof window === "undefined") return;

    const message = buildIncorrectAnswersMessage(userAnswers);
    if (!message) {
      alert("No hay respuestas incorrectas para enviar ✅");
      return;
    }
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedMessage}`;
    window.open(whatsappURL, "_blank");
  };

  const copyToClipboard = () => {
    if (typeof navigator === "undefined") return;

    const message = buildIncorrectAnswersMessage(userAnswers);
    if (!message) {
      alert("No hay respuestas incorrectas para copiar ✅");
      return;
    }

    navigator.clipboard.writeText(message);
    setShowToast(true);
  };

  return (
    <div ref={resultRef}>
      <h3>
        Resultado: <strong>{score}</strong>/<strong>{total}</strong>
      </h3>

      <h3>Tus respuestas:</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {userAnswers.map((entry, index) => (
          <li
            key={index}
            style={{
              textAlign: "left",
              marginBottom: "1rem",
              padding: "1rem",
              borderRadius: "8px",
              backgroundColor: entry.isCorrect ? "#e0f7e9" : "#ffe0e0",
              color: entry.isCorrect ? "#2d8a4f" : "#a00000",
              border: `1px solid ${entry.isCorrect ? "#2d8a4f" : "#a00000"}`,
            }}
          >
            <div>
              <strong>
                ({entry.question.num + 1}) {entry.isCorrect ? "✅" : "❌"}{" "}
                <ReactMarkdown>{entry.question.questionText}</ReactMarkdown>
              </strong>
            </div>
            <br />
            <div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {(Array.isArray(entry.userAnswer) ? entry.userAnswer : [entry.userAnswer]).map(
                  (item, idx) => (
                    <div
                      key={idx}
                      className="item-box-result"
                      style={{ width: "100%", padding: "0.5rem", borderRadius: "6px" }}
                    >
                      {renderAnswerItem(item)}
                    </div>
                  )
                )}
              </div>
            </div>
            <br />
          </li>
        ))}
      </ul>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "1rem" }}>
        {onRetryIncorrect && (
          <button style={{ flex: "1 1 48%" }} onClick={onRetryIncorrect}>
            Corregir
          </button>
        )}
        <button style={{ flex: "1 1 48%" }} onClick={goToMainMenu}>
          Menu
        </button>
        <button style={{ flex: "1 1 48%" }} onClick={sendToWhatsApp}>
          🟢 ✆ Enviar por WhatsApp
        </button>
        <div>
          <button style={{ flex: "1 1 48%" }} onClick={copyToClipboard}>
            📋 Copiar
          </button>
          {showToast && (
            <Toast message="Texto copiado 📋" duration={1000} onClose={() => setShowToast(false)} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Result;
