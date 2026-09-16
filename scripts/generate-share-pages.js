import fs from "fs";
import path from "path";

const root = process.cwd();

const distDir = path.join(root, "dist");
const quizzesDir = path.join(root, "public", "quizzes");

const qIds = [
  "C01",
  "C02",
  "C03",
  "C04",
  "C05",
  "C06",
  "C07",
  "C08",
  "C09",
  "C10",
];

const siteUrl = "https://formacion-cristiana.github.io/mateo";
const siteBase = "/mateo";
const siteTitle = "Catecumenado";

const shareImage = `${siteUrl}/logo-titulo.png`;

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function cleanText(text) {
  return String(text || "")
    .replace(/\r?\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

if (!fs.existsSync(distDir)) {
  console.error("ERROR: No existe la carpeta dist.");
  process.exit(1);
}

for (const id of qIds) {
  const jsonPath = path.join(quizzesDir, `${id}.json`);

  if (!fs.existsSync(jsonPath)) {
    console.warn(`AVISO: No existe ${jsonPath}. Se saltea ${id}.`);
    continue;
  }

  const quiz = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

  const title = cleanText(quiz.title) || id;

  const comment =
    cleanText(quiz.comment) ||
    "Preguntas para repasar lo estudiado.";

  const pageTitle = `${title} — ${siteTitle}`;
  const pageUrl = `${siteUrl}/share/${id}/`;

  const quizUrl = `${siteBase}/#/quizzes/${id}`;

  const html = `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />

    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title>${escapeHtml(pageTitle)}</title>

    <meta
      name="description"
      content="${escapeHtml(comment)}"
    />

    <!-- Open Graph / WhatsApp -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta
      property="og:description"
      content="${escapeHtml(comment)}"
    />
    <meta property="og:image" content="${escapeHtml(shareImage)}" />
    <meta property="og:url" content="${escapeHtml(pageUrl)}" />
    <meta property="og:site_name" content="${escapeHtml(siteTitle)}" />

    <!-- Twitter / X -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta
      name="twitter:title"
      content="${escapeHtml(title)}"
    />
    <meta
      name="twitter:description"
      content="${escapeHtml(comment)}"
    />
    <meta
      name="twitter:image"
      content="${escapeHtml(shareImage)}"
    />

    <meta
      http-equiv="refresh"
      content="0; url=${escapeHtml(quizUrl)}"
    />
  </head>

  <body>
    <p>
      Abriendo el quiz...
    </p>

    <script>
      window.location.replace("${quizUrl}");
    </script>
  </body>
</html>
`;

  const outputDir = path.join(distDir, "share", id);
  const outputFile = path.join(outputDir, "index.html");

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputFile, html, "utf8");

  console.log(`✓ Share page generated: ${pageUrl}`);
}

console.log("✓ Todas las páginas de compartir fueron generadas.");