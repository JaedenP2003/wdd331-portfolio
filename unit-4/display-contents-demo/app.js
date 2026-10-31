const $ = (s) => document.querySelector(s);
const root = document.documentElement;

/* ---- Color scheme: Light / System default / Dark ---- */
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

/* ---- Keyboard / box check for the risky elements ----
   Runs in whatever browser you open the page in, so the report is what
   THAT browser actually does. */
const risky = [...document.querySelectorAll(".risky")];
const report = $("#focus-report");
const toggle = $("#toggle-a11y");

function runCheck() {
  const before = document.activeElement;
  const rows = risky.map((el) => {
    el.focus({ preventScroll: true });
    const canFocus = document.activeElement === el;
    const hasBox = el.getClientRects().length > 0;
    return `<tr><th scope="row">${el.dataset.label}</th>
      <td class="${hasBox ? "ok" : "bad"}">${hasBox ? "✅ has a box" : "❌ no box"}</td>
      <td class="${canFocus ? "ok" : "bad"}">${canFocus ? "✅ can get keyboard focus" : "❌ cannot get keyboard focus"}</td></tr>`;
  });
  report.innerHTML = `<table><tbody>${rows.join("")}</tbody></table>`;
  (before && before !== document.body ? before : toggle).focus({ preventScroll: true });
}
toggle.addEventListener("change", runCheck);
runCheck();
