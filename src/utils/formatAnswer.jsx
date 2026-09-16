// utils/formatAnswer.js
export function formatAnswer(answer) {
  if (!answer) return "(sin respuesta)";

  if (answer.columns && Array.isArray(answer.data)) {
    // matching question format
    const headerLine = answer.columns.join(" | ");
    const rows = answer.data.map(row => row.join(" → "));
    return [headerLine, ...rows].join("\n* ");
  }

  // Strings
  if (typeof answer === "string") return answer;

  if (Array.isArray(answer)) {
    return "* " + answer
      .map(item => (Array.isArray(item) ? item.join(" → ") : String(item)))
      .join("\n* ");
  }

  if (typeof answer === "object") {
    if ("answerText" in answer) return answer.answerText;
    if ("text" in answer) return answer.text;
  }

  return String(answer);
}


/*
falta el caso de respuestas que son imagenes: i.e. objects
export function formatAnswer(answer) {
  if (Array.isArray(answer)) {
    return answer.join("\n");
  } else if (typeof answer === "boolean") {
    return answer ? "Verdadero" : "Falso";
  } else if (typeof answer === "object" && answer !== null) {
    return Object.entries(answer)
      .map(([k, v]) => {
        if (typeof v === "object" && v !== null) {
          return `aaa${k}, ccc${Object.values(v).join(",ddd ")}`; // e.g., Bark / dog.png
        }
        return `(${k}),bbb (${v})`;
      })
      .join("/ ");
  } else {
    return String(answer); // fallback just in case
  }
}
*/