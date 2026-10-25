import { getPrefs, setPref, connectAccount, DEFAULTS, ACCENTS, chime } from "/prefs.js";
import { t, applyI18n, LANGS } from "/i18n.js";
const $ = (s, r = document) => r.querySelector(s);
let save = null, user = null, isStaff = false;
const hasSession = Object.keys(localStorage).some(k => /^sb-.*-auth-token$/.test(k));
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// ---- tiny component builders (our own switches, sliders, pickers: no browser checkboxes)
const row = (lbl, hint, ctl, col) => `<div class="set-row${col ? " col" : ""}"><div><span class="lbl">${lbl}</span>${hint ? `<p>${hint}</p>` : ""}</div>${ctl}</div>`;
const sw = (k, lbl, hint) => row(lbl, hint, `<button type="button" class="switch" role="switch" data-k="${k}" aria-checked="false" aria-label="${esc(lbl)}"><i></i></button>`);
const rng = (k, lbl, hint, min, max, step, marks) => `<div class="set-row col"><div><div class="rng-head"><span class="lbl">${lbl}</span><output data-o="${k}"></output></div>${hint ? `<p>${hint}</p>` : ""}</div><input class="rng" type="range" data-k="${k}" min="${min}" max="${max}" step="${step}" aria-label="${esc(lbl)}"><div class="marks">${marks.map(m => `<span>${m}</span>`).join("")}</div></div>`;
const seg = (k, lbl, opts) => `<div class="set-row col"><span class="lbl" id="l-${k}">${lbl}</span><div class="seg" role="radiogroup" aria-labelledby="l-${k}" data-k="${k}" style="--n:${opts.length};--i:0"><span class="seg-thumb"></span>${opts.map(([v, x]) => `<button type="button" role="radio" data-v="${v}" aria-checked="false">${x}</button>`).join("")}</div></div>`;
const swatches = (k, lbl) => `<div class="set-row col"><span class="lbl" id="l-${k}">${lbl}</span><div class="swatches" role="radiogroup" aria-labelledby="l-${k}" data-k="${k}">${ACCENTS.map(a => `<button type="button" class="sw c-${a}" role="radio" data-v="${a}" aria-checked="false"><b></b>${t("acc." + a)}</button>`).join("")}</div></div>`;
const txt = (k, lbl, hint, max, ph = "") => row(lbl, hint, `<input class="field txt" data-text="${k}" maxlength="${max}" placeholder="${esc(ph)}" aria-label="${esc(lbl)}" autocomplete="off">`);

function render() {
  const sections = [["appearance", t("set.s.appearance")], ["language", t("set.s.language")], ["notifications", t("set.s.notifications")], ["comfort", t("set.s.comfort")]];
  if (user) sections.push(["account", t("set.s.account")]); if (isStaff) sections.push(["staff", "Staff"]);
  $("#setnav").innerHTML = sections.map(([id, n]) => `<a href="#${id}">${n}</a>`).join("");
  $("#panels").innerHTML = `
  <div class="set-head"><p class="eyebrow">${t("set.eyebrow")}</p><h1>${t("set.h1")}</h1><p class="lead">${t("set.lead")}</p></div>
  <section class="set-card" id="appearance"><h2>${t("set.s.appearance")}</h2>
    ${seg("theme", t("set.theme"), [["auto", t("set.theme.auto")], ["light", t("set.theme.light")], ["dark", t("set.theme.dark")]])}
    ${swatches("accent", t("set.accent"))}
    ${rng("size", t("set.size"), t("set.size.hint"), 0.9, 1.3, 0.05, ["90%", "100%", "130%"])}
    ${rng("density", t("set.density"), "", 0, 2, 1, [t("set.dens.0"), t("set.dens.1"), t("set.dens.2")])}
    ${seg("hour", t("set.hour"), [["auto", t("set.hour.auto")], ["12", t("set.hour.12")], ["24", t("set.hour.24")]])}
    <div class="set-row col hour-preview-row"><span class="lbl">${t("set.hour.preview")}</span><p id="hour-preview" aria-live="polite" style="margin:0">—</p></div>
    <div class="set-row col"><span class="lbl">${t("set.preview")}</span><div class="pv"><button type="button" class="ticket-item" tabindex="-1"><strong>${t("set.prevTitle")}</strong><span class="ticket-meta"><span class="status open">${t("st.open")}</span><span>#128</span></span></button><div class="message staff"><div class="message-head"><strong>${esc(getPrefs().staffName || t("msg.team"))} <span class="badge-staff c-${getPrefs().badgeColor}" id="pv-badge">${esc(getPrefs().badge || t("msg.staff"))}</span></strong></div><div class="message-body">${t("set.prevBody")}</div></div></div></div>
  </section>
  <section class="set-card" id="language"><h2>${t("set.s.language")}</h2>
    <div class="set-row col"><p style="margin:0">${t("set.lang.hint")}</p><div class="langs" role="radiogroup" aria-label="${t("set.s.language")}" data-k="lang">${LANGS.map(([c, n]) => `<button type="button" class="lang" role="radio" data-v="${c}" aria-checked="false" lang="${c}"><strong>${n}</strong><small>${c}</small></button>`).join("")}</div></div>
  </section>
  <section class="set-card" id="notifications"><h2>${t("set.s.notifications")}</h2>
    ${sw("notif", t("set.notif"), t("set.notif.hint"))}${sw("emailReplies", t("set.email"), t("set.email.hint"))}${sw("sound", t("set.sound"), t("set.sound.hint"))}
    ${rng("volume", t("set.volume"), "", 0, 1, 0.05, ["0%", "50%", "100%"])}
  </section>
  <section class="set-card" id="comfort"><h2>${t("set.s.comfort")}</h2>
    ${rng("motion", t("set.motion"), t("set.motion.hint"), 0, 2, 1, [t("set.mo.0"), t("set.mo.1"), t("set.mo.2")])}
  </section>
  ${user ? `<section class="set-card" id="account"><h2>${t("set.s.account")}</h2>${txt("displayName", t("set.display"), t("set.display.hint"), 40)}</section>` : `<p class="small" style="margin:0 0 20px"><a class="accent" href="/login.html">${t("set.signin")}</a></p>`}
  ${isStaff ? `<section class="set-card" id="staff"><h2>Staff</h2>
    ${txt("staffName", "Staff display name", "Shown when you claim a ticket and on your replies.", 40, "e.g. Iconology")}
    ${txt("badge", "Badge label", "The small tag next to your name on replies.", 16, "Staff")}
    ${swatches("badgeColor", "Badge colour")}
    ${sw("showName", "Show my name on replies", "Off means players see “Mirage Support Team”.")}
    ${sw("autoClaim", "Claim tickets when I reply", "Assigns an unassigned ticket to you on your first reply.")}
    ${seg("queue", "Open the queue on", [["all", "All tickets"], ["mine", "Assigned to me"], ["unassigned", "Unassigned"]])}
  </section>` : ""}
  <div class="set-actions"><span></span><button type="button" class="button" id="reset">${t("set.reset")}</button></div>`;
  sync();
}
const pct = (el) => ((el.value - el.min) / (el.max - el.min)) * 100 + "%";
const fmt = { size: v => Math.round(v * 100) + "%", volume: v => Math.round(v * 100) + "%", density: v => t("set.dens." + v), motion: v => t("set.mo." + v) };
function sync() {
  const p = getPrefs();
  const hourPreview = $("#hour-preview");
  if (hourPreview) {
    // Use a fixed afternoon time so the 12-hour and 24-hour differences are obvious.
    const sample = new Date(2020, 0, 1, 14, 5, 0);
    const options = { hour: "numeric", minute: "2-digit" };
    if (p.hour === "12") options.hour12 = true;
    else if (p.hour === "24") options.hour12 = false;
    // Auto deliberately leaves hour12 unset so the browser locale decides.
    const formatted = new Intl.DateTimeFormat(p.lang || navigator.language || "en-GB", options).format(sample);
    const mode = p.hour === "12" ? "12-hour" : p.hour === "24" ? "24-hour" : "automatic";
    hourPreview.textContent = `${formatted} · ${mode}`;
  }
  document.querySelectorAll(".switch[data-k]").forEach(b => b.setAttribute("aria-checked", String(!!p[b.dataset.k])));
  document.querySelectorAll(".seg[data-k],.swatches[data-k],.langs[data-k]").forEach(g => {
    const bs = [...g.querySelectorAll("[role=radio]")], i = Math.max(0, bs.findIndex(b => b.dataset.v === String(p[g.dataset.k])));
    bs.forEach((b, j) => { b.setAttribute("aria-checked", String(j === i)); b.tabIndex = j === i ? 0 : -1; }); g.style.setProperty("--i", i);
  });
  document.querySelectorAll(".rng[data-k]").forEach(r => { if (document.activeElement !== r) r.value = p[r.dataset.k]; r.style.setProperty("--pct", pct(r)); const o = $(`[data-o="${r.dataset.k}"]`); if (o) o.textContent = fmt[r.dataset.k](+r.value); });
  document.querySelectorAll("[data-text]").forEach(i => { if (document.activeElement !== i) i.value = p[i.dataset.text] || ""; });
  const b = $("#pv-badge"); if (b) { b.textContent = p.badge || t("msg.staff"); b.className = "badge-staff c-" + p.badgeColor; const n = b.parentElement; n.firstChild.textContent = (p.staffName || t("msg.team")) + " "; }
}
let chipTimer;
function chip(state) {
  const c = $("#save-chip"); c.dataset.s = state; c.textContent = state === "saving" ? t("act.saving") : state === "saved" ? "✓ " + t("set.saved") : t("set.local"); c.classList.add("show");
  clearTimeout(chipTimer); if (state !== "saving") chipTimer = setTimeout(() => c.classList.remove("show"), 1800);
}
function set(patch) {
  setPref(patch, save && (async p => { const ok = await save(p); chip(ok ? "saved" : "local"); }));
  if (save) chip("saving"); else chip("local");
  if ("lang" in patch) { applyI18n(document); render(); } else sync();
}
const num = k => ["size", "volume"].includes(k) ? parseFloat : ["density", "motion"].includes(k) ? parseInt : null;
const panels = $("#panels");
panels.addEventListener("click", async e => {
  const s = e.target.closest(".switch"), r = e.target.closest("[role=radio]");
  if (s) {
    const k = s.dataset.k, v = s.getAttribute("aria-checked") !== "true"; set({ [k]: v });
    if (k === "notif" && v && "Notification" in window && Notification.permission === "default") await Notification.requestPermission();
    if (k === "sound" && v) chime(true);
  } else if (r) { const g = r.closest("[data-k]"); set({ [g.dataset.k]: r.dataset.v }); }
  else if (e.target.id === "reset") { const keep = user ? { displayName: getPrefs().displayName } : {}; set({ ...DEFAULTS, ...keep }); render(); }
});
panels.addEventListener("input", e => {
  const el = e.target;
  if (el.matches(".rng")) { const k = el.dataset.k; el.style.setProperty("--pct", pct(el)); $(`[data-o="${k}"]`).textContent = fmt[k](+el.value); set({ [k]: num(k)(el.value) }); }
  else if (el.dataset.text) set({ [el.dataset.text]: el.value.trim() });
});
panels.addEventListener("change", e => { if (e.target.dataset.k === "volume") chime(true); });
panels.addEventListener("keydown", e => {   // arrow keys move through radio groups
  const g = e.target.closest("[role=radiogroup]"); if (!g || !/Arrow/.test(e.key)) return;
  const bs = [...g.querySelectorAll("[role=radio]")], i = bs.indexOf(document.activeElement); if (i < 0) return;
  const n = bs[(i + (/Right|Down/.test(e.key) ? 1 : bs.length - 1)) % bs.length]; n.focus(); n.click(); e.preventDefault();
});
// highlight the section being read
addEventListener("scroll", () => { let cur = ""; document.querySelectorAll(".set-card").forEach(c => { if (c.getBoundingClientRect().top < 160) cur = c.id; }); document.querySelectorAll("#setnav a").forEach(a => a.classList.toggle("on", a.getAttribute("href") === "#" + cur)); }, { passive: true });

(async () => {
  render();
  if (hasSession) try {
    const m = await import("/supabase.js");
    if (m.configured) { const { data } = await m.supabase.auth.getUser(); user = data?.user || null;
      if (user) { save = await connectAccount(m.supabase, user); isStaff = await m.isStaff(user.id); applyI18n(document); render(); } }
  } catch { /* stay in local-only mode */ }
})();
