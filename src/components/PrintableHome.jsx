// components/PrintableHome.jsx
import React, { useEffect, useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import { qIds } from "../data/quizInfo";
import {QuizButtons} from "./QuizButtons"

function PrintableHome() {
  const [quizzes, setQuizzes] = useState([]);

useEffect(() => {
  const loadTitles = async () => {
    const loaded = await Promise.all(
      qIds.map(async (id) => {
        try {
          const res = await fetch(`${import.meta.env.BASE_URL}quizzes/${id}.json`);
          if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
          }
          const data = await res.json();
          console.log("Loaded quiz:", data.title);
          return {
            id: data.id,
            title: data.title,
            date: data.date,
            comment: data.comment
          };
        } catch (err) {
          console.error(`Error loading quiz "${id}":`, err);
          return null;
        }
      })
    );
    setQuizzes(loaded.filter(q => q !== null));
  };
    loadTitles();
  }, []);

  return (
    <div>
      <h2>Imprimibles</h2>
      <ul style={{ paddingLeft: "0rem" }}>
        <li>
                  <Link to="/print-all">📄 Imprimir todos los quizzes</Link>
        </li>
        {QuizButtons(quizzes,'/printable/quizzes/')}
      </ul>
    </div>
  ) ;
}

export default PrintableHome;
