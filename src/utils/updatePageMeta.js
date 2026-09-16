export function updatePageMeta(title, comment) {
  // Update page title
  document.title = title;

  // Build description with quiz title + comment
  const descriptionText = `"${comment}" en "${title}".`;

  // Update or create meta description
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute("content", descriptionText);
  } else {
    const newMeta = document.createElement("meta");
    newMeta.name = "description";
    newMeta.content = descriptionText;
    document.head.appendChild(newMeta);
  }
}
