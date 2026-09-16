// components/PrintableAllQuizzesPage.jsx
import React, { useEffect, useState, useRef } from "react";
import PrintableAllQuizzesOptimized from "./PrintableAllQuizzesOptimized";
import { qIds } from "../data/quizInfo";

function PrintableAllQuizzesPage() {
  const [quizzes, setQuizzes] = useState([]);
  const printRef = useRef(null);

  useEffect(() => {
    const loadQuizzes = async () => {
      const loaded = [];
      for (const id of qIds) {
        const res = await fetch(`${import.meta.env.BASE_URL}quizzes/${id}.json`);
        const data = await res.json();
        loaded.push(data);
      }
      setQuizzes(loaded);
    };
    loadQuizzes();
  }, []);

  if (quizzes.length === 0) return <div>Cargando quizzes...</div>;

  return (
    <div>
      {/* Pass the quizzes and ref */}
      <PrintableAllQuizzesOptimized quizzes={quizzes} printRef={printRef} />
    </div>
  );
}

export default PrintableAllQuizzesPage;
