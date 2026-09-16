// src/App.jsx
import React, { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { Helmet } from "react-helmet";

import QuizLoader from "./components/QuizLoader";
import { qIds, qTitle } from "./data/quizInfo";
import PrintableHome from "./components/PrintableHome";
import PrintableQuizPage from "./components/PrintableQuizPage";
import PrintableAllQuizzesPage from "./components/PrintableAllQuizzesPage";

import { QuizButtons } from "./components/QuizButtons";

// Home component accepts preloaded quizzes
function Home({ preloadedQuizzes = [] }) {
  const [quizzes, setQuizzes] = useState(preloadedQuizzes);

  useEffect(() => {
    // Only fetch if not prerendered
    if (preloadedQuizzes.length === 0) {
      const loadTitles = async () => {
        const loaded = await Promise.all(
          qIds.map(async (id) => {
            const res = await fetch(`${import.meta.env.BASE_URL}quizzes/${id}.json`);
            const data = await res.json();
            return {
              id: data.id,
              title: data.title,
              date: data.date,
              comment: data.comment,
            };
          })
        );
        setQuizzes(loaded);
      };
      loadTitles();
    }
  }, [preloadedQuizzes]);

  return (
    <>
      <ul style={{ paddingLeft: "0rem" }}>
        {QuizButtons(quizzes, "/quizzes/")}
      </ul>

      <div style={{ marginTop: "2rem", textAlign: "center" }}>
        <Link
          to="/printable"
          style={{ textDecoration: "underline", fontSize: "1.1rem" }}
        >
          📄 Imprimir
        </Link>
      </div>
    </>
  );
}

// App component accepts props for SSR prerender
export default function App({ initialQuizId = null, preloadedQuizzes = [] }) {
  return (
    <>
      <Helmet>
        <title>{qTitle}</title>
        <meta
          name="description"
          content="Preguntas para repasar lo estudiado."
        />
      </Helmet>

      <div className="App" style={{ marginBottom: "3rem" }}>
        <a href={import.meta.env.BASE_URL}>
          <img
            src={import.meta.env.BASE_URL + "logo-titulo.png"}
            alt=""
            style={{
              maxWidth: "100%",
              height: "auto",
              marginBottom: "1rem",
              borderRadius: "10px",
            }}
          />
        </a>
        <h4>{qTitle}</h4>

        <Routes>
          <Route path="/" element={<Home preloadedQuizzes={preloadedQuizzes} />} />
          <Route
            path="/quizzes/:quizId"
            element={
              <QuizLoader
                preloadedQuiz={
                  initialQuizId
                    ? preloadedQuizzes.find((q) => q.id === initialQuizId)
                    : null
                }
              />
            }
          />
          <Route path="/printable" element={<PrintableHome />} />
          <Route
            path="/printable/quizzes/:quizId"
            element={<PrintableQuizPage />}
          />
          <Route path="/print-all" element={<PrintableAllQuizzesPage />} />
        </Routes>
      </div>
    </>
  );
}
