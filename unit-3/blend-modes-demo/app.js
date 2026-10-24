const MODES = ["normal","multiply","screen","overlay","darken","lighten","color-dodge","color-burn",
  "hard-light","soft-light","difference","exclusion","hue","saturation","color","luminosity"];

const $ = (s) => document.querySelector(s);
const root = document.documentElement;

/* ---- Color scheme toggle: Light / System default / Dark ---- */
function applyScheme(v) {
  if (v === "system") root.removeAttribute("data-theme"); else root.setAttribute("data-theme", v);
  try { localStorage.setItem("scheme", v); } catch {}
}
let saved = "system";
try { saved = localStorage.getItem("scheme") || "system"; } catch {}
document.querySelectorAll('input[name="scheme"]').forEach((r) => {
  r.checked = r.value === saved;
  r.addEventListener("change", () => applyScheme(r.value));
});
applyScheme(saved);

/* ---- Hero controls ---- */
const hero = $("#hero");
const modeSelect = $("#hero-mode");
MODES.forEach((m) => modeSelect.add(new Option(m, m)));
modeSelect.value = "multiply";
modeSelect.addEventListener("change", () => { hero.style.backgroundBlendMode = modeSelect.value; });
$("#overlay").addEventListener("input", (e) => root.style.setProperty("--overlay", e.target.value));
$("#use-gradient").addEventListener("change", (e) => hero.classList.toggle("is-gradient", e.target.checked));

/* ---- All-16 comparison grid ---- */
const grid = $("#mode-grid");
MODES.forEach((m) => {
  const fig = document.createElement("figure");
  fig.innerHTML = `<div class="tile" style="background-blend-mode:${m}"></div><figcaption><code>${m}</code></figcaption>`;
  fig.addEventListener("click", () => {
    modeSelect.value = m;
    hero.style.backgroundBlendMode = m;
    $("#hero-demo").scrollIntoView({ behavior: "smooth" });
  });
  grid.append(fig);
});

/* ---- Accessibility slider: move both texts across the photo ---- */
$("#slide").addEventListener("input", (e) => {
  document.querySelectorAll(".textbox").forEach((b) => b.style.setProperty("--x", e.target.value + "%"));
});

/* ---- Isolation toggle ---- */
$("#iso-toggle").addEventListener("change", (e) => $("#iso-card").classList.toggle("is-isolated", e.target.checked));
