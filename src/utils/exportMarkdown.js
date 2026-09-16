// utils/exportMarkdown.js
import { prepareMatchingQuestion } from "./prepareMatchingQuestion";

export function exportMarkdown(quizzes, filename = "quizzes.md") {
  // SSR-safe: exit if window is undefined
  if (typeof window === "undefined") return;

  // Generate Markdown string
  let md = "";

  quizzes.forEach((quiz) => {
    md += `# ${quiz.title}\n\n`;
    if (quiz.comment) md += `*${quiz.comment}*\n\n`;

    quiz.questions.forEach((q, idx) => {
      md += `### ${idx + 1}. ${q.questionText}\n\n`;

      if (["multiple-choice", "ordering"].includes(q.type)) {
        const items =
          q.type === "ordering"
            ? q.shuffledItems || q.correctAnswer
            : q.answerOptions?.map((a) => a.answerText) || [];
        items.forEach((item) => {
          md += `- [ ] ${item}\n`;
        });
        md += "\n";
      }

      if (q.type === "matching") {
        const { headers, rows } = prepareMatchingQuestion(q, true); // true = don't shuffle for export
        md += "| " + headers.join(" | ") + " |\n";
        md += "| " + headers.map(() => "---").join(" | ") + " |\n";
        rows.forEach((row) => {
          md += "| " + row.join(" | ") + " |\n";
        });
        md += "\n";
      }
    });

    md += "\n---\n\n";
  });

  // Open new tab with plain markdown text
  const newTab = window.open();
  if (!newTab) return;

  newTab.document.open();
  newTab.document.write(`
    <html>
      <head>
        <title>${filename}</title>
        <style>
          body { font-family: monospace; white-space: pre-wrap; padding: 2rem; }
          button { margin-right: 1rem; padding: 0.5rem 1rem; cursor: pointer; }
          .button-container { display: flex; gap: 10px; margin: 1rem 0; }
        </style>
      </head>
      <body>
        <div class="button-container">
          <button id="copyBtn">Copiar Texto</button>
          <button id="downloadBtn">Descargar Texto</button>
        </div>
        <pre id="markdownContent">${md.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
        <script>
          const mdString = \`${md.replace(/`/g, "\\`")}\`;

          document.getElementById('copyBtn').addEventListener('click', () => {
            navigator.clipboard.writeText(mdString)
              .then(() => alert('Markdown copied to clipboard!'))
              .catch(() => alert('Failed to copy'));
          });

          document.getElementById('downloadBtn').addEventListener('click', () => {
            const blob = new Blob([mdString], { type: "text/markdown;charset=utf-8" });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = "${filename}";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          });
        </script>
      </body>
    </html>
  `);
  newTab.document.close();
}
