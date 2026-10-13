const params = new URLSearchParams(window.location.search);
const root = document.querySelector("#submissionSummary");
const fields = [
  ["Name", params.get("name")],
  ["Email", params.get("email")],
  ["Topic", params.get("topic")],
  ["Message", params.get("message")],
];
const submitted = fields.some(([, value]) => value);
if (!submitted) {
  root.innerHTML =
    "<p>No form values were found. Please use the feedback form to submit a message.</p><p><a href='feedback.html'>Open feedback form</a></p>";
} else {
  root.innerHTML = `<h2>Thank you, ${escapeText(params.get("name") || "visitor")}.</h2><dl>${fields.map(([label, value]) => `<div><dt><strong>${label}</strong></dt><dd>${escapeText(value || "Not provided")}</dd></div>`).join("")}</dl>`;
}
function escapeText(value) {
  const node = document.createElement("span");
  node.textContent = value;
  return node.innerHTML;
}
