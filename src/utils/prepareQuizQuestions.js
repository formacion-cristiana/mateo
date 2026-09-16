//utils/prepareQuizQuestions.js
import { shuffleArray } from "./shuffleArray";
import { prepareMatchingQuestion } from "./prepareMatchingQuestion";

/**
 * Prepares quiz questions for rendering or export.
 * @param {Array} questions - Array of question objects
 * @param {boolean} shuffle - Whether to shuffle answers/columns
 * @returns {Array} prepared questions
 */
export function prepareQuizQuestions(questions, shuffle = true) {
  return questions.map(q => {
    if (q.type === "ordering") {
      const items = q.correctAnswer ?? [];
      return { ...q, shuffledItems: shuffle ? shuffleArray(items) : items };
    }
    if (q.type === "multiple-choice") {
      const options = q.answerOptions?.map(opt => opt.answerText) ?? [];
      return { ...q, shuffledItems: options };
    }
    if (q.type === "matching") {
      const { headers, rowHeaders, rows } = prepareMatchingQuestion(q, shuffle, true);
      return {
        ...q,
        shuffledColumns: rows[0] ? rows[0].map((_, i) => rows.map(r => r[i])) : [],
        headers,
        rowHeaders
      };
    }
    return q;
  });
}
