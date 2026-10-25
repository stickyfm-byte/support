import { CATS, ARTICLES } from "/articles.js";
import { suggest } from "/suggest.js";
import { getPrefs, setPref, applyPrefs, connectAccount } from "/prefs.js";
import { t, applyI18n } from "/i18n.js";
applyPrefs(); const langAtLoad = getPrefs().lang; let accountSave = null;
const hasSession = Object.keys(localStorage).some(k => /^sb-.*-auth-token$/.test(k));
const path = location.pathname;
const nav = (h, key, cur) => `<a href="${h}"${cur ? ' aria-current="page"' : ""} data-i18n="${key}">${t(key)}</a>`;
document.body.insertAdjacentHTML("afterbegin", `<svg width="0" height="0" style="position:absolute"><filter id="haze" x="-5%" y="-300%" width="110%" height="700%"><feTurbulence type="fractalNoise" baseFrequency="0.01 0.12" numOctaves="2" seed="4" result="n"><animate attributeName="baseFrequency" dur="16s" values="0.01 0.12;0.015 0.15;0.01 0.12" repeatCount="indefinite"/></feTurbulence><feDisplacementMap in="SourceGraphic" in2="n" scale="7"/></filter><filter id="resolve"><feTurbulence type="fractalNoise" baseFrequency="0.008 0.07" numOctaves="2" seed="9" result="n"/><feDisplacementMap id="rz" in="SourceGraphic" in2="n" scale="0"/></filter></svg>`);
const header = `<a class="brand" href="/"><img src="/assets/mirage-logo.png" alt="" width="30" height="33"><span class="brand-name">Mirage <span data-i18n="brand.support">${t("brand.support")}</span></span></a><button class="menu-btn" type="button" aria-expanded="false" aria-controls="site-nav" data-i18n-aria="nav.menu" aria-label="${t("nav.menu")}"><span aria-hidden="true">☰</span></button><nav class="site-nav" id="site-nav">${nav("/", "nav.help", path === "/" || path === "/index.html")}${nav(hasSession ? "/dashboard/" : "/login.html", hasSession ? "nav.requests" : "nav.signin")}${nav("/settings.html", "nav.settings", path.startsWith("/settings"))}<a class="status-chip" id="sc" href="https://miragesmp.org/status/"><i aria-hidden="true"></i><span data-i18n="status.default">${t("status.default")}</span></a><a class="nav-cta" href="${hasSession ? "/dashboard/" : "/login.html"}" data-i18n="nav.new">${t("nav.new")}</a><button class="theme-btn" id="theme-btn" type="button"></button></nav>`;
const old = document.querySelector("header.topbar");
if (old) { const staffBits = old.querySelector(".row"); old.innerHTML = header; if (staffBits && /staff|dashboard/.test(location.pathname)) old.append(staffBits); }
else document.body.insertAdjacentHTML("afterbegin", `<header class="topbar">${header}</header>`);
document.querySelector(".footer")?.remove();
document.body.insertAdjacentHTML("afterbegin", `<a class="skip" href="#content" data-i18n="nav.skip">${t("nav.skip")}</a>`);
document.querySelector("main")?.setAttribute("id", "content");
const mb = document.querySelector(".menu-btn"), nv = document.getElementById("site-nav");
mb?.addEventListener("click", () => mb.setAttribute("aria-expanded", String(nv.classList.toggle("open"))));
addEventListener("keydown", e => { if (e.key === "Escape" && nv?.classList.contains("open")) { nv.classList.remove("open"); mb.setAttribute("aria-expanded", "false"); mb.focus(); } });

// Live status chip: reads the public status page (cached 5 min). Falls back to a plain "Status" link if it can't.
(async () => {
  const chip = document.getElementById("sc"); if (!chip) return;
  try {
    let st = sessionStorage.getItem("mst"), at = +sessionStorage.getItem("mst_t") || 0;
    if (!st || Date.now() - at > 3e5) {
      const r = await fetch("https://miragesmp.org/status/", { signal: AbortSignal.timeout(6000) }); if (!r.ok) throw 0;
      const txt = new DOMParser().parseFromString(await r.text(), "text/html").body.textContent.replace(/\s+/g, " ");
      const hits = [...txt.matchAll(/(Website|Minecraft Server|Applications|Discord)\s*(Operational|Open|Closed|Degraded|Maintenance|Outage|Offline|Down)/gi)].map(m => m[2].toLowerCase());
      if (!hits.length) throw 0;
      st = hits.some(w => /outage|offline|down/.test(w)) ? "down" : hits.some(w => /degraded|maintenance/.test(w)) ? "warn" : "ok";
      sessionStorage.setItem("mst", st); sessionStorage.setItem("mst_t", Date.now());
    }
    chip.dataset.s = st;
    const lab = chip.querySelector("span"); lab.dataset.i18n = "status." + st; lab.textContent = t("status." + st);
  } catch { /* leave the plain Status link */ }
})();
document.body.insertAdjacentHTML("beforeend", `<footer class="footer"><span>© Mirage Productions</span><a href="https://discord.gg/mirageevents">Discord</a><a href="/terms.html" data-i18n="footer.terms">${t("footer.terms")}</a><a href="/privacy-policy.html" data-i18n="footer.privacy">${t("footer.privacy")}</a><a href="mailto:contact@miragesmp.org">contact@miragesmp.org</a></footer>`);

// Theme toggle: remembers the choice, otherwise follows the device setting
{
  const btn = document.getElementById("theme-btn"), root = document.documentElement, mq = matchMedia("(prefers-color-scheme: light)");
  const cur = () => root.dataset.theme || (mq.matches ? "light" : "dark");
  const sun = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  const moon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
  const sync = () => {
    const light = cur() === "light";
    btn.innerHTML = light ? moon : sun; btn.setAttribute("aria-label", t(light ? "theme.toDark" : "theme.toLight"));
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", light ? "#f3f8fb" : "#031827");
  };
  btn?.addEventListener("click", () => { setPref({ theme: cur() === "light" ? "dark" : "light" }, accountSave); });
  addEventListener("prefs-applied", () => btn && sync());
  mq.addEventListener?.("change", sync); if (btn) sync();
}

// Reveal on scroll
const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && (e.target.classList.add("in"), io.unobserve(e.target))), { threshold: .12 });
document.querySelectorAll(".reveal").forEach((el, i) => { el.style.setProperty("--i", i % 6); io.observe(el); });

// Hero headline "resolves" out of heat haze, then the filter is removed
const h1 = document.querySelector(".hero h1");
if (h1 && getPrefs().motion === 2 && !matchMedia("(prefers-reduced-motion:reduce)").matches) {
  const rz = document.getElementById("rz"); h1.style.filter = "url(#resolve)"; const t0 = performance.now();
  (function f(t) { const p = Math.min((t - t0) / 1500, 1); rz.setAttribute("scale", 26 * (1 - p) ** 3); p < 1 ? requestAnimationFrame(f) : h1.style.filter = ""; })(t0);
}

// Search palette ( / or Ctrl+K )
let pal;
const open = () => {
  if (pal) return; let sel = 0, hits = [];
  const opener = document.activeElement;
  pal = document.createElement("div"); pal.className = "pal"; pal.setAttribute("role", "dialog"); pal.setAttribute("aria-modal", "true"); pal.setAttribute("aria-label", t("pal.ph"));
  pal.innerHTML = `<div><input placeholder="${t("pal.ph")}" aria-label="${t("pal.ph")}"><section role="listbox" aria-label="Results"></section></div>`;
  const input = pal.querySelector("input"), list = pal.querySelector("section");
  const draw = () => {
    hits = input.value.trim() ? suggest(input.value, { n: 7 }) : ARTICLES.filter(a => a.popular).slice(0, 6);
    list.innerHTML = hits.length ? hits.map((a, i) => `<a href="/article.html#a=${a.id}" role="option" aria-selected="${i === sel}" class="${i === sel ? "sel" : ""}">${a.title}<small>${t("cat." + a.cat + ".t")} · ${t("pal.by")} ${a.author}</small></a>`).join("") : `<div class="empty">${t("pal.none")} <a href="/dashboard/" style="display:inline;color:var(--accent);padding:0;border:0">${t("pal.open")}</a></div>`;
  };
  const close = () => { pal.remove(); pal = null; opener?.focus?.(); };
  pal.addEventListener("click", e => e.target === pal && close());
  input.addEventListener("input", () => { sel = 0; draw(); });
  input.addEventListener("keydown", e => {
    if (e.key === "Escape") close();
    if (e.key === "Tab") e.preventDefault(); // keep focus in the search box; use arrow keys for results
    if (e.key === "ArrowDown") sel = Math.min(sel + 1, hits.length - 1), draw(), e.preventDefault();
    if (e.key === "ArrowUp") sel = Math.max(sel - 1, 0), draw(), e.preventDefault();
    if (e.key === "Enter" && hits[sel]) location.href = "/article.html#a=" + hits[sel].id;
  });
  document.body.append(pal); draw(); input.focus();
};
document.querySelectorAll("[data-search]").forEach(b => b.addEventListener("click", open));
addEventListener("keydown", e => { if ((e.key === "/" && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) || ((e.ctrlKey || e.metaKey) && e.key === "k")) { e.preventDefault(); open(); } });

applyI18n();
// Pull this account's saved settings (language, theme, accent...) so they follow the player between devices
if (hasSession) (async () => {
  try {
    const m = await import("/supabase.js"); if (!m.configured) return;
    const { data } = await m.supabase.auth.getUser(); if (!data?.user) return;
    accountSave = await connectAccount(m.supabase, data.user);
    if (getPrefs().lang !== langAtLoad) location.reload(); else applyI18n();
  } catch { /* offline: local settings still apply */ }
})();
