// Per-account settings: stored on this device instantly, and synced to Supabase when signed in.
const KEY = "mprefs";
export const DEFAULTS = { lang: "en", theme: "auto", accent: "cyan", size: 1, density: 1, motion: 2, hour: "auto", notif: true, emailReplies: true, sound: false, volume: 0.5, displayName: "",
  staffName: "", badge: "Staff", badgeColor: "cyan", showName: true, autoClaim: false, queue: "all" };
export const ACCENTS = ["cyan", "violet", "mint", "rose", "gold"];
export function getPrefs() { try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) || "{}") }; } catch { return { ...DEFAULTS }; } }
const store = p => { try { localStorage.setItem(KEY, JSON.stringify(p)); } catch {} };
export function applyPrefs(p = getPrefs()) {
  const r = document.documentElement;
  if (p.theme === "auto") delete r.dataset.theme; else r.dataset.theme = p.theme;
  r.dataset.accent = p.accent; r.dataset.motion = p.motion; r.dataset.density = p.density;
  r.style.setProperty("--fs", p.size); r.lang = p.lang;
  window.dispatchEvent(new Event("prefs-applied"));
}
let timer;
export function setPref(patch, sync) {
  const p = { ...getPrefs(), ...patch }; store(p); applyPrefs(p);
  if (sync) { clearTimeout(timer); timer = setTimeout(() => sync(p), 700); }
  return p;
}
// Pulls the saved settings for a signed-in account (the account's copy wins), then returns a saver.
export async function connectAccount(supabase, user) {
  try {
    const { data } = await supabase.from("user_settings").select("settings").eq("user_id", user.id).maybeSingle();
    if (data?.settings && Object.keys(data.settings).length) { const p = { ...DEFAULTS, ...data.settings }; store(p); applyPrefs(p); }
  } catch { /* offline or table missing: keep local settings */ }
  return async p => {
    const { error } = await supabase.from("user_settings").upsert({ user_id: user.id, settings: p, updated_at: new Date().toISOString() });
    return !error;
  };
}
// A soft two-note chime for new replies (no audio file needed).
export function chime(force) {
  const p = getPrefs(); if (!force && !p.sound) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)(), now = ctx.currentTime;
    [[660, 0], [880, 0.14]].forEach(([f, d]) => {
      const o = ctx.createOscillator(), g = ctx.createGain(); o.type = "sine"; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, now + d); g.gain.exponentialRampToValueAtTime(Math.max(0.001, p.volume * 0.22), now + d + 0.03); g.gain.exponentialRampToValueAtTime(0.0001, now + d + 0.45);
      o.connect(g).connect(ctx.destination); o.start(now + d); o.stop(now + d + 0.5);
    });
    setTimeout(() => ctx.close(), 1200);
  } catch { /* audio blocked until the user interacts */ }
}
