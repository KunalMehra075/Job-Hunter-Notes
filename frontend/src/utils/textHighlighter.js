// Escape HTML so user-controlled note text / variable values can't inject markup
// (output is rendered via dangerouslySetInnerHTML).
const escapeHtml = (str = "") =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

// Highlight {{key}} tokens using the user's dynamic variables.
// `variables` is an array of { key, value, color }.
const highlightText = (text, variables = []) => {
  const map = new Map(variables.map((v) => [v.key, v]));

  return text
    .split(/(\{\{[^}]+\}\})/g)
    .map((part) => {
      if (part.startsWith("{{") && part.endsWith("}}")) {
        const key = part.slice(2, -2).trim();
        const variable = map.get(key);
        if (variable) {
          const color = variable.color || "#22c55e";
          const display = escapeHtml(variable.value || key);
          return `<span style="background-color:${color}33;color:${color};padding:0 4px;border-radius:4px">${display}</span>`;
        }
        // Unknown variable -> red
        return `<span style="background-color:#ef444433;color:#ef4444;padding:0 4px;border-radius:4px">${escapeHtml(
          part
        )}</span>`;
      }
      return escapeHtml(part);
    })
    .join("");
};

export default highlightText;
