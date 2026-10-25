// Live updates (Supabase Realtime) and browser notifications, shared by the player and staff pages.
import { t } from "/i18n.js";
import { getPrefs } from "/prefs.js";
export const supported = () => "Notification" in window;
export function notify(title, body, onClick) {
  if (getPrefs().notif === false || !supported() || Notification.permission !== "granted") return;
  const n = new Notification(title, { body, icon: "/assets/favicon.png", tag: title + body });
  n.onclick = () => { window.focus(); onClick?.(); n.close(); };
}
export function setupBell(btn) {
  if (!btn) return;
  const paint = () => {
    if (!supported()) { btn.hidden = true; return; }
    const p = Notification.permission;
    btn.textContent = t(p === "granted" ? "bell.on" : p === "denied" ? "bell.blocked" : "bell.default");
    btn.disabled = p !== "default";
  };
  btn.addEventListener("click", async () => { await Notification.requestPermission(); paint(); });
  paint();
}
export function liveBadge(el) {
  return state => { if (!el) return; const ok = state === "SUBSCRIBED"; el.dataset.s = ok ? "on" : "off"; el.textContent = t(ok ? "live.on" : "live.off"); };
}
export function listen(supabase, name, { onMessage, onTicket, onState }) {
  return supabase.channel(name)
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "ticket_messages" }, p => onMessage?.(p.new))
    .on("postgres_changes", { event: "*", schema: "public", table: "tickets" }, p => onTicket?.(p))
    .subscribe(state => onState?.(state));
}
