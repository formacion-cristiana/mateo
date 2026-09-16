/**
 * Scrolls smoothly so that the given element is just below the fixed header.
 * SSR-safe: does nothing on the server.
 * @param {HTMLElement} element - The DOM element to scroll to.
 * @param {number} extraOffset - Additional offset in pixels (default: 0).
 */
export function scrollToElementBelowHeader(element, extraOffset = 0) {
  // Guard for SSR / missing element
  if (typeof window === "undefined" || !element) return;

  const header = document.querySelector("header");
  const headerHeight = header ? header.offsetHeight : 0;

  // Use window.scrollY if available, fallback to document.documentElement.scrollTop
  const scrollY =
    typeof window.scrollY !== "undefined"
      ? window.scrollY
      : document.documentElement.scrollTop || 0;

  const elementPosition = element.getBoundingClientRect().top + scrollY;
  const offsetPosition = elementPosition - headerHeight - extraOffset;

  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth",
  });
}
