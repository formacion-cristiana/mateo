// utils/buildIncorrectAnswersMessage.js
import { formatAnswer } from "./formatAnswer";

export function buildIncorrectAnswersMessage(userAnswers) {
  const incorrectAnswers = userAnswers.filter(entry => !entry.isCorrect);

  if (incorrectAnswers.length === 0) {
    return null; // means no incorrect answers
  }
  
const pageTitle = document.title;
    let message = `*${userAnswers[0]?.quizTitle}*\n\n📋 Preguntas a discutir:\n\n`;
  incorrectAnswers.forEach((entry) => {
    message += `------\n(${entry.question.num + 1}) ${entry.question.questionText}\n\n`;
    message += `${formatAnswer(entry.userAnswer)}\n\n`;
  });

  return message.trim();
}
