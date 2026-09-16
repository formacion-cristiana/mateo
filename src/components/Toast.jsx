import React, { useEffect } from "react";

export default function Toast({ message, duration = 1000, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div style={{
      position: "fixed",
      top: "20px",
      right: "20px",
      background: "#333",
      color: "#fff",
      padding: "10px 16px",
      borderRadius: "6px",
      zIndex: 9999,
      opacity: 0.95
    }}>
      {message}
    </div>
  );
}
