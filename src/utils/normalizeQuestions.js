export function normalizeQuestions(questions) {
  return questions.map((q,idx) => {
    if (q.type === "true-false") {
      const p = {
        ...q, // copy all properties from q, object spread syntax
        type: "multiple-choice", // override type
        num: idx, // add/override num
        answerOptions: [
          { answerText: "Verdadero", isCorrect: q.correctAnswer === true },
          { answerText: "Falso", isCorrect: q.correctAnswer === false },
        ],
      };

      return p;
    }
    q.num=idx;
    return q;
  });
}
