import { loadStates } from "./data.mjs";
const $ = (selector) => document.querySelector(selector);
const grid = $("#stateGrid"),
  search = $("#searchInput"),
  region = $("#regionFilter"),
  sort = $("#sortSelect"),
  count = $("#resultCount"),
  favoritesList = $("#favoritesList"),
  dialog = $("#stateDialog");
let states = [];
let favorites = new Set(
  JSON.parse(localStorage.getItem("ngde-favorites") || "[]"),
);
const number = (value) => new Intl.NumberFormat("en-NG").format(value);
function card(state) {
  const saved = favorites.has(state.name);
  return `<article class="state-card"><div class="card-top"><h2>${state.name}</h2><span class="region-pill">${state.region}</span></div><dl><div><dt>Capital</dt><dd>${state.capital}</dd></div><div><dt>Population est.</dt><dd>${number(state.population)}</dd></div><div><dt>Area (km²)</dt><dd>${number(state.area)}</dd></div><div><dt>Languages</dt><dd>${state.languages.join(", ")}</dd></div></dl><p><strong>Ethnic communities:</strong> ${state.ethnicGroups.join(", ")}</p><div class="card-actions"><button type="button" data-details="${state.name}" class="outline">Details</button><button type="button" data-favorite="${state.name}" class="${saved ? "saved" : ""}" aria-pressed="${saved}">${saved ? "★ Saved" : "☆ Save"}</button></div></article>`;
}
function filtered() {
  let result = [...states];
  const term = search.value.trim().toLocaleLowerCase();
  if (term)
    result = result.filter((s) =>
      [s.name, s.capital, s.region, ...s.ethnicGroups, ...s.languages].some(
        (value) => value.toLocaleLowerCase().includes(term),
      ),
    );
  if (region.value) result = result.filter((s) => s.region === region.value);
  switch (sort.value) {
    case "pop-desc":
      result.sort((a, b) => b.population - a.population);
      break;
    case "pop-asc":
      result.sort((a, b) => a.population - b.population);
      break;
    case "name-desc":
      result.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case "area-desc":
      result.sort((a, b) => b.area - a.area);
      break;
    default:
      result.sort((a, b) => a.name.localeCompare(b.name));
  }
  return result;
}
function render() {
  const result = filtered();
  count.textContent = `Showing ${result.length} of ${states.length} entries`;
  grid.innerHTML = result.length
    ? result.map(card).join("")
    : `<p class="empty">No states match these filters. Try another search.</p>`;
}
function renderFavorites() {
  const list = states.filter((s) => favorites.has(s.name));
  favoritesList.innerHTML = list.length
    ? list
        .map(
          (s) =>
            `<span class="favorite-chip">${s.name} · ${s.capital} <button type="button" class="outline" data-remove="${s.name}" aria-label="Remove ${s.name} from saved states">Remove</button></span>`,
        )
        .join("")
    : "<p>No saved states yet. Select ☆ Save on a state card to add one.</p>";
}
function showDetails(name) {
  const state = states.find((s) => s.name === name);
  if (!state) return;
  $("#dialogContent").innerHTML =
    `<h2 id="dialogTitle">${state.name}, Nigeria</h2><p><strong>Capital:</strong> ${state.capital}</p><p><strong>Geopolitical zone:</strong> ${state.region}</p><p><strong>Population estimate:</strong> ${number(state.population)}</p><p><strong>Area:</strong> ${number(state.area)} km²</p><p><strong>Ethnic communities listed:</strong> ${state.ethnicGroups.join(", ")}</p><p><strong>Languages listed:</strong> ${state.languages.join(", ")}</p>`;
  dialog.showModal();
}
grid.addEventListener("click", (event) => {
  const details = event.target.closest("[data-details]");
  const favorite = event.target.closest("[data-favorite]");
  if (details) showDetails(details.dataset.details);
  if (favorite) {
    const name = favorite.dataset.favorite;
    favorites.has(name) ? favorites.delete(name) : favorites.add(name);
    localStorage.setItem("ngde-favorites", JSON.stringify([...favorites]));
    renderFavorites();
    render();
  }
});
favoritesList.addEventListener("click", (event) => {
  const remove = event.target.closest("[data-remove]");
  if (remove) {
    favorites.delete(remove.dataset.remove);
    localStorage.setItem("ngde-favorites", JSON.stringify([...favorites]));
    renderFavorites();
    render();
  }
});
[search, region, sort].forEach((control) =>
  control.addEventListener(control === search ? "input" : "change", render),
);
$("#clearFilters").addEventListener("click", () => {
  search.value = "";
  region.value = "";
  sort.value = "name-asc";
  render();
});
$("#clearFavorites").addEventListener("click", () => {
  favorites.clear();
  localStorage.setItem("ngde-favorites", "[]");
  renderFavorites();
  render();
});
$("#closeDialog").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});
try {
  states = await loadStates();
  render();
  renderFavorites();
} catch (error) {
  count.textContent = "State data unavailable";
  grid.innerHTML = `<p class="empty">Unable to load the local JSON data. Serve this folder using a local web server (for example, VS Code Live Server) or open the deployed GitHub Pages site.</p>`;
}
