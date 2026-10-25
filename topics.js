// Topic-first request form. Each topic maps to one of the database categories and defines its own extra fields.
// To add a field, add an object to a topic's `fields`. Types: text, textarea, select, date.
export const TOPICS = [
  { id: "account", title: "Account & sign-in", cat: "Account", blurb: "Sign-in, verification, email or username", subject: "e.g. Can't sign in after verifying",
    fields: [
      { name: "task", label: "What are you trying to do?", type: "select", required: true, options: ["Sign in", "Verify my email", "Reset my password", "Change my email or username", "Something else"] },
      { name: "method", label: "How did you sign up?", type: "select", options: ["Email and password", "Discord", "Not sure"] }],
    body: { label: "What's happening?", ph: "Tell us what you see, including any error message…" } },
  { id: "ingame", title: "Problem in game", cat: "In-game issue", blurb: "Something went wrong while playing", subject: "e.g. Disconnected when joining the event",
    fields: [
      { name: "ign", label: "Your Minecraft username", type: "text", required: true },
      { name: "when", label: "When did it happen?", type: "date" }],
    body: { label: "What happened?", ph: "Describe what you were doing and what went wrong…" } },
  { id: "bug", title: "Report a bug", cat: "Bug report", blurb: "Something broken you can repeat", subject: "e.g. Chest GUI freezes when opened",
    fields: [
      { name: "ign", label: "Your Minecraft username", type: "text", required: true },
      { name: "steps", label: "Steps to repeat it", type: "textarea", required: true, ph: "1. Go to…\n2. Click…\n3. See the problem" },
      { name: "expected", label: "What you expected to happen", type: "text" },
      { name: "often", label: "How often does it happen?", type: "select", options: ["Every time", "Sometimes", "Only once"] }],
    body: { label: "What actually happened?", ph: "Include any error text you saw…" } },
  { id: "report", title: "Report a player", cat: "Player report", blurb: "Tell us about a rule concern", subject: "e.g. Player harassing others in chat",
    fields: [
      { name: "target", label: "Player's username", type: "text", required: true },
      { name: "ign", label: "Your Minecraft username", type: "text" },
      { name: "when", label: "When did it happen?", type: "date", required: true },
      { name: "rule", label: "Which rule do you think was broken?", type: "text" }],
    body: { label: "What happened?", ph: "Keep it factual. Attach a screenshot below as evidence if you have one." } },
  { id: "appeal", title: "Appeal a punishment", cat: "Appeal", blurb: "Ask for a ban or mute to be reviewed", subject: "e.g. Ban appeal",
    fields: [
      { name: "ign", label: "Your Minecraft username", type: "text", required: true },
      { name: "kind", label: "What was the punishment?", type: "select", required: true, options: ["Ban", "Mute", "Kick", "Warning", "Not sure"] },
      { name: "when", label: "When did it happen?", type: "date", required: true },
      { name: "reason", label: "Reason you were given", type: "text" }],
    body: { label: "Why should this be reviewed?", ph: "Be honest and specific about what happened from your side…" } },
  { id: "general", title: "Something else", cat: "General Support", blurb: "Questions and anything that doesn't fit", subject: "e.g. Question about events",
    fields: [], body: { label: "How can we help?", ph: "Tell us what you need…" } }
];
import { t } from "/i18n.js";
const FIELD_KEY = { task: "f.task", method: "f.method", ign: "f.ign", when: "f.when", steps: "f.steps", expected: "f.expected", often: "f.often", target: "f.target", rule: "f.rule", kind: "f.kind", reason: "f.reason" };
const OPT_KEY = { "Sign in": "nav.signin", "Verify my email": "o.verify", "Reset my password": "o.reset", "Change my email or username": "o.change", "Something else": "tp.general.t", "Email and password": "o.emailpw", "Discord": "o.discord", "Not sure": "o.notsure", "Every time": "o.every", "Sometimes": "o.some", "Only once": "o.once", "Ban": "o.ban", "Mute": "o.mute", "Kick": "o.kick", "Warning": "o.warn" };
export const BODY_KEY = { account: "b.account", ingame: "b.ingame", bug: "b.bug", report: "b.ingame", appeal: "b.appeal", general: "b.general" };
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
export function renderFields(tp) {
  const today = new Date().toISOString().slice(0, 10);
  return tp.fields.map(f => {
    const id = "f-" + f.name, req = f.required ? " required" : "", star = f.required ? "" : " " + t("detail.optional");
    const ctl = f.type === "select" ? `<select class="field" id="${id}" name="x_${f.name}"${req}>${f.required ? '<option value="" disabled selected>' + t("f.choose") + '</option>' : '<option value="">' + t("f.choose") + '</option>'}${f.options.map(o => `<option value="${esc(o)}">${esc(t(OPT_KEY[o] || o))}</option>`).join("")}</select>`
      : f.type === "textarea" ? `<textarea class="field" id="${id}" name="x_${f.name}" maxlength="800" placeholder=""${req}></textarea>`
      : `<input class="field" id="${id}" name="x_${f.name}" type="${f.type}" ${f.type === "date" ? `max="${today}"` : 'maxlength="120"'}${req}>`;
    return `<label for="${id}">${esc(t(FIELD_KEY[f.name] || f.label))}${star}${ctl}</label>`;
  }).join("");
}
// Turns the topic fields + description into the first message staff will read.
export function composeBody(tp, values) {
  const lines = tp.fields.map(f => [f, String(values.get("x_" + f.name) || "").trim()]).filter(([, v]) => v)
    .map(([f, v]) => f.type === "textarea" ? `${f.label}:\n${v}` : `${f.label}: ${v}`);
  const text = String(values.get("body") || "").trim();
  return (lines.length ? lines.join("\n") + "\n\n" : "") + (lines.length ? tp.body.label + ":\n" : "") + text;
}
