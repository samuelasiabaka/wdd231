const toggle = document.querySelector("#navToggle");
const nav = document.querySelector("#mainNav");
if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute(
      "aria-label",
      open ? "Close navigation menu" : "Open navigation menu",
    );
    toggle.textContent = open ? "✕ Close" : "☰ Menu";
  });
}
const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();
const current =
  location.pathname.split("/").pop().replace(".html", "") || "index";
document.querySelectorAll("[data-nav]").forEach((link) => {
  if (link.dataset.nav === current) link.setAttribute("aria-current", "page");
});
