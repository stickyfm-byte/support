import { ARTICLES } from "/articles.js";
const STOP = new Set("a an the i my me is are was it to of and or in on for with can do does how what why when not no cant cannot dont isnt im ive have has be this that get got you your please help".split(" "));
const stem = w => w.replace(/(ing|ed|es|s)$/, "");
const tok = s => s.toLowerCase().replace(/<[^>]+>/g, " ").replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(w => w.length > 1 && !STOP.has(w)).map(stem);
const idx = ARTICLES.map(a => ({ a, t: tok(a.title), k: tok(a.keys), b: new Set(tok(a.body)) }));
// Maps the ticket form's categories onto help-centre categories so matches in the right area rank higher.
export const catFor = c => ({ "Account": "account", "In-game issue": "playing", "Bug report": "playing", "Player report": "reports", "Appeal": "reports", "General Support": "start" })[c];
const hit = (list, q) => list.some(w => w === q || (q.length >= 3 && w.startsWith(q)));
export function suggest(text, { cat, n = 4, exclude } = {}) {
  const q = [...new Set(tok(text))]; if (!q.length) return [];
  return idx.filter(x => x.a.id !== exclude).map(x => {
    let s = 0;
    for (const w of q) s += hit(x.t, w) * 3 + hit(x.k, w) * 2 + (x.b.has(w) ? 1 : 0);
    return { a: x.a, s: s + (s && cat === x.a.cat ? 2 : 0) };
  }).filter(r => r.s >= 3).sort((p, q2) => q2.s - p.s).slice(0, n).map(r => r.a);
}
