// PrintableQuiz.jsx
import React, { useRef, useState } from "react";
import html2pdf from "html2pdf.js";
import { shuffleArray } from "../utils/shuffleArray";
import "../styles/PrintableQuiz.css";
import { normalizeQuestions } from "../utils/normalizeQuestions";
import ReactMarkdown from 'react-markdown';

function PrintableQuiz({ quiz, hideExportButton = false }) {
  const printRef = useRef(null);
  const [exporting, setExporting] = useState(false);

  const handleExportPDF = () => {
    setExporting(true);
    const opt = {
      margin: 10,
      filename: `${quiz.title}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["css", "legacy"] },
    };

    html2pdf()
      .set(opt)
      .from(printRef.current)
      .save()
      .finally(() => setExporting(false));
  };

  // 🔁 Normalize questions as before
  const normalized = normalizeQuestions(quiz.questions);
  const shuffledQuestions = normalized.map((q) => {
    if (q.type === "ordering") {
      const sourceItems = q.correctAnswer ?? [];
      return { ...q, shuffledItems: shuffleArray(sourceItems) };
    }
    if (q.type === "multiple-choice") {
      const options = q.answerOptions?.map((opt) => opt.answerText) ?? [];
      return { ...q, shuffledItems: options };
    }
    if (q.type === "matching") {
