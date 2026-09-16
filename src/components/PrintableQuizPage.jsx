// components/PrintableQuizPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PrintableQuiz from "./PrintableQuiz";

function PrintableQuizPage() {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`${import.meta.env.BASE_URL}quizzes/${quizId}.json`);
      const data = await res.json();
      setQuiz(data);
    };
    load();
  }, [quizId]);

  if (!quiz) return <div>Cargando...</div>;

  return <PrintableQuiz quiz={quiz} />;
}

export default PrintableQuizPage;
