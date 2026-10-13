import { loadStates } from "./data.mjs";
const stats = document.querySelector(".stats");
try {
  const states = await loadStates();
  const regions = new Set(states.map((state) => state.region));
  stats.innerHTML = `<article class="stat"><strong>${states.length}</strong><span>State and FCT entries loaded from JSON</span></article><article class="stat"><strong>${regions.size}</strong><span>Geopolitical zones represented</span></article><article class="stat"><strong>${states.reduce((total, state) => total + state.languages.length, 0)}</strong><span>State-language entries in this dataset</span></article>`;
} catch (error) {
  stats.insertAdjacentHTML(
    "afterend",
    `<p class="notice" role="status">The summary data could not load. Open this project through a local web server or GitHub Pages, then refresh.</p>`,
  );
}
