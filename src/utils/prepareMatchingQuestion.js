// utils/prepareMatchingQuestion.js
import { shuffleArray } from "./shuffleArray";

/**
 * Prepares a matching question for rendering or export
 * @param {Object} question - The matching question object
 * @param {boolean} shuffleColumns - Whether to shuffle columns (default: true)
 * @param {boolean} skipFirstColumn - Whether to keep first column unshuffled (default: true)
 * @returns {Object} - { headers: string[], rowHeaders: string[], rows: string[][] }
 */
export function prepareMatchingQuestion(question, shuffleColumns = true, skipFirstColumn = true) {
  if (!question.correctAnswer || !Array.isArray(question.correctAnswer)) return { headers: [], rowHeaders: [], rows: [] };
  
  const colCount = question.correctAnswer[0].length;
  const rowCount = question.correctAnswer.length;

  // Only use headers if they exist
  const headers = Array.isArray(question.columns) ? question.columns : [];
  const rowHeaders = Array.isArray(question.rowHeaders) ? question.rowHeaders : [];

  // Build columns
  const columns = Array.from({ length: colCount }, (_, colIndex) => {
    const colItems = question.correctAnswer.map(row => row[colIndex]);
    if (shuffleColumns && (!skipFirstColumn || colIndex > 0)) return shuffleArray(colItems);
    return colItems;
  });

  // Convert columns → rows
  const rows = Array.from({ length: rowCount }, (_, rowIndex) => {
    return columns.map(col => col[rowIndex]);
  });

  return { headers, rowHeaders, rows };
}
