import React, { useEffect, useState } from "react";
import { useNavigate} from "react-router-dom";
import ReactMarkdown from 'react-markdown';

export function formatQuizButton(quiz){
    return <div>
    {quiz.date}
    <br />
    <br />
    <div style={{fontSize:"1rem"}}>{quiz.title}</div> 
    <br />
    <ReactMarkdown>
        {quiz.comment}
    </ReactMarkdown>
    </div>
}

export function QuizButtons(quizzes,path){
   const navigate = useNavigate();
    return (quizzes.map((quiz) => (
          <li key={quiz.id}>
            <button onClick={() => navigate(`${path}${quiz.id}`)}>
              {formatQuizButton(quiz)}
            </button>
          </li>
        )));
}
