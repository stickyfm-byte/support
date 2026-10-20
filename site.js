import { CATS, ARTICLES } from "/articles.js";
const hasSession = Object.keys(localStorage).some(k => /^sb-.*-auth-token$/.test(k));
const path = location.pathname;
const nav = (h, t, cur) => `<a href="${h}"${cur ? ' aria-current="page"' : ""}>${t}</a>`;
document.body.insertAdjacentHTML("afterbegin", `<svg width="0" height="0" style="position:absolute"><filter id="haze" x="-5%" y="-300%" width="110%" height="700%"><feTurbulence type="fractalNoise" baseFrequency="0.01 0.12" numOctaves="2" seed="4" result="n"><animate attributeName="baseFrequency" dur="16s" values="0.01 0.12;0.015 0.15;0.01 0.12" repeatCount="indefinite"/></feTurbulence><feDisplacementMap in="SourceGraphic" in2="n" scale="7"/></filter><filter id="resolve"><feTurbulence type="fractalNoise" baseFrequency="0.008 0.07" numOctaves="2" seed="9" result="n"/><feDisplacementMap id="rz" in="SourceGraphic" in2="n" scale="0"/></filter></svg>`);
const header = `<a class="brand" href="/"><img src="/assets/mirage-logo.png" alt="" width="30" height="33"><span class="brand-name">Mirage <span>Support</span></span></a><nav class="site-nav">${nav("/", "Help centre", path === "/" || path === "/index.html")}${nav(hasSession ? "/dashboard/" : "/login.html", hasSession ? "My requests" : "Sign in")}<a href="https://miragesmp.org/status/">Status ↗</a><a class="nav-cta" href="${hasSession ? "/dashboard/" : "/login.html"}">New request</a></nav>`;
const old = document.querySelector("header.topbar");
if (old) { const staffBits = old.querySelector(".row"); old.innerHTML = header; if (staffBits && /staff|dashboard/.test(location.pathname)) old.append(staffBits); }
else document.body.insertAdjacentHTML("afterbegin", `<header class="topbar">${header}</header>`);
document.querySelector(".footer")?.remove();
document.body.insertAdjacentHTML("beforeend", `<footer class="footer"><span>© Mirage Productions</span><a href="https://discord.gg/mirageevents">Discord</a><a href="/terms.html">Terms</a><a href="/privacy-policy.html">Privacy</a><a href="mailto:contact@miragesmp.org">contact@miragesmp.org</a></footer>`);

// Reveal on scroll
const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && (e.target.classList.add("in"), io.unobserve(e.target))), { threshold: .12 });
document.querySelectorAll(".reveal").forEach((el, i) => { el.style.setProperty("--i", i % 6); io.observe(el); });

// Hero headline "resolves" out of heat haze, then the filter is removed
const h1 = document.querySelector(".hero h1");
if (h1 && !matchMedia("(prefers-reduced-motion:reduce)").matches) {
  const rz = document.getElementById("rz"); h1.style.filter = "url(#resolve)"; const t0 = performance.now();
  (function f(t) { const p = Math.min((t - t0) / 1500, 1); rz.setAttribute("scale", 26 * (1 - p) ** 3); p < 1 ? requestAnimationFrame(f) : h1.style.filter = ""; })(t0);
}

// Search palette ( / or Ctrl+K )
let pal;
const open = () => {
  if (pal) return; let sel = 0, hits = [];
  pal = document.createElement("div"); pal.className = "pal";
  pal.innerHTML = `<div><input placeholder="Search help articles…" aria-label="Search"><section></section></div>`;
  const input = pal.querySelector("input"), list = pal.querySelector("section");
  const draw = () => {
    const q = input.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
    hits = ARTICLES.filter(a => q.every(w => (a.title + " " + a.keys).toLowerCase().includes(w))).slice(0, 7);
    list.innerHTML = hits.length ? hits.map((a, i) => `<a href="/article.html?a=${a.id}" class="${i === sel ? "sel" : ""}">${a.title}<small>${CATS.find(c => c.id === a.cat).title}</small></a>`).join("") : `<div class="empty">Nothing found. <a href="/dashboard/" style="display:inline;color:var(--accent);padding:0;border:0">Open a request</a> instead.</div>`;
  };
  const close = () => { pal.remove(); pal = null; };
  pal.addEventListener("click", e => e.target === pal && close());
  input.addEventListener("input", () => { sel = 0; draw(); });
  input.addEventListener("keydown", e => {
    if (e.key === "Escape") close();
    if (e.key === "ArrowDown") sel = Math.min(sel + 1, hits.length - 1), draw(), e.preventDefault();
    if (e.key === "ArrowUp") sel = Math.max(sel - 1, 0), draw(), e.preventDefault();
    if (e.key === "Enter" && hits[sel]) location.href = "/article.html?a=" + hits[sel].id;
  });
  document.body.append(pal); draw(); input.focus();
};
document.querySelectorAll("[data-search]").forEach(b => b.addEventListener("click", open));
addEventListener("keydown", e => { if ((e.key === "/" && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) || ((e.ctrlKey || e.metaKey) && e.key === "k")) { e.preventDefault(); open(); } });
