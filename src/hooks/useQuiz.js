import { useState } from "react";
import { shuffleArray } from "../utils/shuffleArray";
import { normalizeQuestions } from "../utils/normalizeQuestions";

// Move this helper out so we can apply it to already normalized questions
function deduceCorrectAnswer(question) {
  if (question.type === "multiple-choice" && Array.isArray(question.answerOptions)) {
    const correctAnswers = question.answerOptions
      .filter((opt) => opt.isCorrect)
      .map((opt) => opt.answerText);

    return {
      ...question,
      correctAnswer: correctAnswers.join(", "),
    };
  }

  return question;
}

export function useQuiz(quizData) {
  const { title: quizTitle, questions: questionsInput } = quizData;

  // 🔁 Step 1: Normalize (convert true/false to multiple-choice)
  const normalized = normalizeQuestions(questionsInput);

  // ✅ Step 2: Deduce correct answers where applicable
  const processedQuestions = normalized.map(deduceCorrectAnswer);

  // 🎯 Now continue as usual
  const [allQuestions] = useState(processedQuestions);
  const [questions, setQuestions] = useState(allQuestions);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentMaxIndex, setCurrentMaxIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
  const [lastCorrectAnswer, setLastCorrectAnswer] = useState(null);
  const [navigationLocked, setNavigationLocked] = useState(false);

  const currentQuestion = questions[currentIndex];
  const isQuizComplete = currentIndex >= questions.length;



function retryIfEverIncorrect(answers) {
  const incorrectNums = new Set(
    answers
      .filter(a => !a.isCorrect)
      .map(a => a.question?.num) // ✅ num is inside question
  );

  const out = [];
  const seen = new Set();
  for (const a of answers) {
    const num = a.question?.num;
    if (incorrectNums.has(num) && !seen.has(num)) {
      seen.add(num);
      out.push(a.question);
    }
  }
  return out;
}


function retryIncorrectOnly() {
  const incorrectQuestions = retryIfEverIncorrect(userAnswers);
    /* setQuestions(shuffleArray(incorrectQuestions));*/
    setQuestions(incorrectQuestions);
    setCurrentIndex(0);
    setCurrentMaxIndex(0);
    setUserAnswers([]);
    setShowFeedback(false);
    setIsCorrectAnswer(false);
  }

  function resetQuiz() {
    setQuestions(allQuestions);
    setCurrentIndex(0);
    setCurrentMaxIndex(0);    
    setUserAnswers([]);
    setShowFeedback(false);
    setIsCorrectAnswer(false);
  }


function handleAnswer(answer, isCorrect = null, correctAnswerOverride = null) {
  const correct =
    isCorrect !== null
      ? isCorrect
      : currentQuestion.type === "ordering" || currentQuestion.type === "matching"
      ? JSON.stringify(answer) === JSON.stringify(currentQuestion.correctAnswer)
      : answer === currentQuestion.correctAnswer;

  let savedAnswer = answer;

  if (currentQuestion.type === "matching") {
    // Attach columns along with the answer inside userAnswer
    savedAnswer = {
      columns: currentQuestion.columns,
      data: answer,
    };
  }

  setUserAnswers((prev) => [
    ...prev,
    {
      question: currentQuestion,
      userAnswer: savedAnswer,
      isCorrect: correct,
      correctAnswer: correctAnswerOverride ?? currentQuestion.correctAnswer,
      quizTitle,
    },
  ]);


    setIsCorrectAnswer(correct);
    setLastCorrectAnswer(      correctAnswerOverride ??      currentQuestion.correctAnswer    );

    setShowFeedback(true);

    //const delay = correct ? 1000 : (currentQuestion.type === "matching" || currentQuestion.type === "ordering") ? 10000: 5000;


    if (correct) {
      setNavigationLocked(true); // 🚫 disable navigation
      const delay = 1000;
      setTimeout(() => {
        setShowFeedback(false);
        setCurrentIndex((prev) => prev + 1);
        setCurrentMaxIndex((prev) => prev + 1);
        setNavigationLocked(false); // ✅ re-enable navigation
      }, delay);
    }

  }

  const score = userAnswers.filter((entry) => entry.isCorrect).length;

  return {
    currentQuestion,
    userAnswers,
    setUserAnswers,
    handleAnswer,
    showFeedback,
    setShowFeedback,
    lastCorrectAnswer,
    isCorrectAnswer,
    setIsCorrectAnswer,
    isQuizComplete,
    resetQuiz,
    retryIncorrectOnly,
    score,
    total: questions.length,
    currentIndex, 
    setCurrentIndex,
    currentMaxIndex,
    setCurrentMaxIndex,
    navigationLocked,
  };
}
