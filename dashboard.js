import { suggest, catFor } from "/suggest.js";
import { ARTICLES } from "/articles.js";
import { t } from "/i18n.js";
import { getPrefs, chime } from "/prefs.js";
import { TOPICS, renderFields, composeBody, BODY_KEY } from "/topics.js";
import { downloadTranscript } from "/transcript.js";
import { listen, notify, setupBell, liveBadge } from "/live.js";
import { supabase, requireUser, isStaff, showMessage, escapeHtml, formatDate, signOut } from "./supabase.js";

const $ = (selector) => document.querySelector(selector);
const notice = $("#notice"), list = $("#ticket-list"), detail = $("#ticket-detail");
let user = null, selectedTicket = null, staff = false, busy = false, ticketsCache = [];

$("#signout")?.addEventListener("click", signOut);

try {
  user = await requireUser();
  if (!user || !supabase) throw new Error("Sign in to use the support portal.");
  $("#user-label").textContent = user.email || "Signed in with Discord";
  staff = await isStaff(user.id);
  if (staff) $("#staff-link")?.classList.remove("hidden");
  await loadTickets();
} catch (error) {
  showMessage(notice, friendlyError(error, "We could not start the support portal. Refresh the page and try again."), true);
  if (list) list.innerHTML = '<p class="empty">Your tickets could not be loaded. Use the message above to troubleshoot.</p>';
}

function friendlyError(error, fallback) {
  const raw = String(error?.message || error || "");
  const lower = raw.toLowerCase();
  if (lower.includes("row-level security") || lower.includes("permission denied") || lower.includes("not allowed")) {
    return "The database denied this action. The support database policies may need to be applied or updated. Details: " + raw;
  }
  if (lower.includes("does not exist") || lower.includes("schema cache") || lower.includes("could not find the table")) {
    return "A required support table or column is missing. Check the Supabase setup SQL. Details: " + raw;
  }
  if (lower.includes("failed to fetch") || lower.includes("network")) return "Could not reach Supabase. Check your connection and try again.";
  return raw || fallback;
}

function setBusy(button, value, label) {
  if (!button) return;
  button.disabled = value;
  if (value) { button.dataset.originalText = button.textContent; button.textContent = label || "Working…"; }
  else if (button.dataset.originalText) { button.textContent = button.dataset.originalText; delete button.dataset.originalText; }
}

function validateImage(file) {
  if (!(file instanceof File) || !file.size) return "";
  if (!["image/png","image/jpeg","image/webp","image/gif"].includes(file.type)) return t("err.image");
  if (file.size > 5 * 1024 * 1024) return t("err.size");
  return "";
}

async function uploadAttachment(file, ticketId) {
  if (!(file instanceof File) || !file.size) return null;
  const problem = validateImage(file);
  if (problem) throw new Error(problem);
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-100) || "attachment";
  const path = ticketId + "/" + user.id + "/" + crypto.randomUUID() + "-" + safeName;
  const { error } = await supabase.storage.from("ticket-attachments").upload(path, file, { upsert: false, contentType: file.type });
  if (error) throw error;
  return path;
}

function renderTicket(ticket) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "ticket-item" + (selectedTicket === ticket.id ? " selected" : "");
  const title = document.createElement("strong");
  title.textContent = ticket.subject;
  const meta = document.createElement("span");
  meta.className = "ticket-meta";
  const status = document.createElement("span");
  status.className = "status " + ticket.status;
  status.textContent = t("st." + ticket.status);
  const category = document.createElement("span");
  category.textContent = ticket.category;
  const updated = document.createElement("span");
  updated.dataset.timestamp = ticket.updated_at; updated.classList.add("formatted-date"); updated.textContent = formatDate(ticket.updated_at);
  meta.append(status, category, updated);
  button.append(title, meta);
  button.addEventListener("click", () => openTicket(ticket));
  return button;
}

async function loadTickets() {
  if (!supabase || !list) return;
  list.innerHTML = '<p class="empty">Loading your requests…</p>';
  const { data, error } = await supabase.from("tickets")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) {
    list.innerHTML = '<p class="empty">Unable to load tickets.</p>';
    showMessage(notice, friendlyError(error, "Tickets could not be loaded."), true);
    return;
  }
  list.replaceChildren(); ticketsCache = data || [];
  if (!data?.length) {
    list.innerHTML = '<div class="empty"><strong>No requests yet</strong><br>Your support history will appear here after you send your first ticket.</div>';
    return;
  }
  data.forEach(ticket => list.append(renderTicket(ticket)));
}

$("#new-ticket")?.addEventListener("submit", async event => {
  event.preventDefault();
  if (busy) return;
  const form = event.currentTarget;
  const submit = form.querySelector('button[type="submit"]');
  const values = new FormData(form);
  const subject = String(values.get("subject") || "").trim();
  const file = values.get("attachment");
  if (!topic) return showMessage(notice, t("err.topic"), true);
  const category = topic.cat;
  const body = composeBody(topic, values);
  if (subject.length < 3) return showMessage(notice, t("err.subject"), true);
  if (!body) return showMessage(notice, t("err.body"), true);
  const fileProblem = validateImage(file);
  if (fileProblem) return showMessage(notice, fileProblem, true);
  busy = true; setBusy(submit, true, t("act.creating"));
  let ticket = null, attachmentPath = null;
  try {
    const requester_name = getPrefs().displayName || user.user_metadata?.username || user.user_metadata?.full_name || "Player";
    const cols = "*";
    let result = await supabase.from("tickets").insert({ created_by: user.id, subject, category, requester_name }).select(cols).single();
    if (result.error && /requester_name/.test(result.error.message)) // migration not applied yet
      result = await supabase.from("tickets").insert({ created_by: user.id, subject, category }).select(cols).single();
    if (result.error) throw result.error;
    ticket = result.data;
    try { attachmentPath = await uploadAttachment(file, ticket.id); }
    catch (uploadError) {
      showMessage(notice, "Ticket created, but the image could not be uploaded. Your written message will still be sent. " + friendlyError(uploadError), true);
    }
    const { error: messageError } = await supabase.from("ticket_messages").insert({
      ticket_id: ticket.id, sender_id: user.id, body, attachment_path: attachmentPath
    });
    if (messageError) {
      showMessage(notice, "Your ticket was created, but its first message failed to save. Please retry in this ticket or contact support. " + friendlyError(messageError), true);
      await loadTickets();
      return;
    }
    form.reset(); form.hidden = true; $("#step-topic").hidden = false; topic = null;
    selectedTicket = ticket.id;
    showMessage(notice, t("ok.created"));
    await loadTickets();
    await openTicket(ticket, false);
  } catch (error) {
    showMessage(notice, friendlyError(error, "We could not create your ticket. Please try again."), true);
  } finally {
    busy = false; setBusy(submit, false);
  }
});

async function renderMessages(ticket, messages) {
  const thread = $("#thread");
  thread.replaceChildren();
  if (!messages?.length) {
    thread.innerHTML = '<p class="empty">Your conversation starts here. Staff replies will appear in this space.</p>';
    return;
  }
  for (const message of messages) {
    const fromStaff = message.is_staff;
    const item = document.createElement("article");
    item.className = "message" + (fromStaff ? " staff" : "");
    const head = document.createElement("div");
    head.className = "message-head";
    const author = document.createElement("strong");
    author.textContent = message.sender_id === user.id ? t("msg.you") : (fromStaff ? (message.sender_name || t("msg.team")) : "Ticket participant");
    if (fromStaff) { const b = document.createElement("span"); b.className = "badge-staff" + (["cyan","violet","mint","rose","gold"].includes(message.sender_color) ? " c-" + message.sender_color : ""); b.textContent = message.sender_badge || t("msg.staff"); author.append(" ", b); }
    const date = document.createElement("span");
    date.dataset.timestamp = message.created_at; date.classList.add("formatted-date"); date.textContent = formatDate(message.created_at);
    head.append(author, date);
    const body = document.createElement("div");
    body.className = "message-body";
    body.textContent = message.body || (message.attachment_path ? t("msg.attached") : "");
    item.append(head, body);
    if (message.attachment_path) {
      const { data, error } = await supabase.storage.from("ticket-attachments").createSignedUrl(message.attachment_path, 300);
      if (!error && data?.signedUrl) {
        const link = document.createElement("a");
        link.href = data.signedUrl; link.target = "_blank"; link.rel = "noopener noreferrer";
        link.textContent = t("msg.view"); link.className = "text-link attachment-link";
        item.append(link);
      } else {
        const note = document.createElement("p"); note.className = "small"; note.textContent = t("msg.unavail"); item.append(note);
      }
    }
    thread.append(item);
  }
}

let currentTicket = null, currentMessages = [], pendingRating = 0;
async function openTicket(ticket, shouldScroll = true) {
  selectedTicket = ticket.id; currentTicket = ticket;
  detail.classList.remove("hidden");
  $("#ticket-title").textContent = ticket.subject;
  $("#ticket-info").textContent = ticket.category + " · " + formatDate(ticket.created_at) + (ticket.assigned_name ? " · " + t("detail.handled", { name: ticket.assigned_name }) : "");
  const status = $("#ticket-status");
  status.textContent = t("st." + ticket.status);
  status.className = "status " + ticket.status;
  $("#thread").innerHTML = '<p class="empty">Loading conversation…</p>';
  const { data: messages, error } = await supabase.from("ticket_messages")
    .select("id,sender_id,body,attachment_path,created_at,is_staff")
    .eq("ticket_id", ticket.id).order("created_at", { ascending: true });
  if (error) {
    showMessage(notice, friendlyError(error, "This conversation could not be loaded."), true);
    $("#thread").innerHTML = '<p class="empty">Conversation unavailable.</p>';
    return;
  }
  currentMessages = messages || [];
  await renderMessages(ticket, currentMessages);
  const closed = ticket.status === "closed";
  syncClosePanel(ticket);
  $("#reply-form").classList.toggle("hidden", closed);
  $("#reply-closed-note")?.classList.toggle("hidden", !closed);
  await loadTickets();
  if (shouldScroll) detail.scrollIntoView({ behavior: "smooth", block: "start" });
}

$("#reply-form")?.addEventListener("submit", async event => {
  event.preventDefault();
  if (busy || !selectedTicket) return;
  const form = event.currentTarget;
  const submit = form.querySelector('button[type="submit"]');
  const values = new FormData(form);
  const body = String(values.get("body") || "").trim();
  const file = values.get("attachment");
  if (!body && !(file instanceof File && file.size)) return showMessage(notice, t("err.reply"), true);
  const fileProblem = validateImage(file);
  if (fileProblem) return showMessage(notice, fileProblem, true);
  busy = true; setBusy(submit, true, t("act.sending"));
  try {
    const { data: ticket, error: ticketError } = await supabase.from("tickets")
      .select("id,status").eq("id", selectedTicket).single();
    if (ticketError) throw ticketError;
    if (ticket.status === "closed" && !staff) throw new Error(t("detail.closedNote"));
    const attachmentPath = await uploadAttachment(file, selectedTicket);
    const { error } = await supabase.from("ticket_messages").insert({
      ticket_id: selectedTicket, sender_id: user.id, body, attachment_path: attachmentPath
    });
    if (error) throw error;
    form.reset();
    showMessage(notice, t("ok.sent"));
    const { data: latest, error: latestError } = await supabase.from("tickets")
      .select("*").eq("id", selectedTicket).single();
    if (latestError) throw latestError;
    await loadTickets();
    await openTicket(latest, false);
  } catch (error) {
    showMessage(notice, friendlyError(error, "Your reply could not be sent. Please try again."), true);
  } finally {
    busy = false; setBusy(submit, false);
  }
});


// ---- Topic-first form
const topicsBox = $("#topics"), newForm = $("#new-ticket");
let topic = null;
topicsBox.innerHTML = TOPICS.map(tp => `<button type="button" class="topic" data-id="${tp.id}"><strong>${t("tp." + tp.id + ".t")}</strong><span>${t("tp." + tp.id + ".b")}</span></button>`).join("");
topicsBox.addEventListener("click", e => { const b = e.target.closest(".topic"); if (b) pickTopic(TOPICS.find(tp => tp.id === b.dataset.id)); });
$("#change-topic").addEventListener("click", () => { newForm.hidden = true; $("#step-topic").hidden = false; topic = null; });
function pickTopic(tp) {
  topic = tp; $("#step-topic").hidden = true; newForm.hidden = false;
  $("#topic-title").textContent = t("tp." + tp.id + ".t"); newForm.elements.subject.placeholder = t("new.subjectPh");
  $("#body-label").textContent = t(BODY_KEY[tp.id]); newForm.elements.body.placeholder = "";
  $("#topic-fields").innerHTML = renderFields(tp); runSuggest(); newForm.elements.subject.focus();
}
function runSuggest() {
  if (!topic) return;
  const f = new FormData(newForm), text = f.get("subject") + " " + f.get("body"), cat = catFor(topic.cat);
  let hits = suggest(text, { cat, n: 3 });
  if (!hits.length) hits = ARTICLES.filter(a => a.cat === cat).slice(0, 3);
  const box = $("#suggest"); box.hidden = !hits.length;
  box.innerHTML = hits.length ? "<strong>" + t("sugg.title") + "</strong>" + hits.map(a => `<a href="/article.html#a=${a.id}" target="_blank" rel="noopener">${a.title} <span aria-hidden="true">↗</span></a>`).join("") : "";
}

// ---- Transcript, close and rate
$("#export-btn").addEventListener("click", () => currentTicket && downloadTranscript(currentTicket, currentMessages,
  m => m.is_staff ? "Mirage Support Team (Staff)" : (currentTicket.requester_name || "Player")));
function syncClosePanel(ticket) {
  const closed = ticket.status === "closed", rated = ticket.rating != null;
  pendingRating = 0; $("#rate-comment").value = ""; document.querySelectorAll(".rate-btn").forEach(b => b.setAttribute("aria-pressed", "false"));
  $("#close-btn").classList.toggle("hidden", closed);
  $("#close-panel").classList.add("hidden");
  const note = $("#rated-note"); note.classList.toggle("hidden", !(closed && rated));
  if (closed && rated) note.textContent = t("msg.rated", { v: ticket.rating === 1 ? "👍" : "👎" }) + (ticket.rating_comment ? ' · "' + ticket.rating_comment + '"' : "");
  if (closed && !rated) openRatePanel(true);
}
function openRatePanel(rateOnly) {
  const p = $("#close-panel"); p.classList.remove("hidden"); p.dataset.mode = rateOnly ? "rate" : "close";
  $("#rate-title").firstElementChild.textContent = rateOnly ? t("detail.howdid") : t("detail.helped");
  $("#confirm-close").textContent = rateOnly ? t("detail.sendFb") : t("detail.close");
  $("#cancel-close").classList.toggle("hidden", rateOnly);
}
$("#close-btn").addEventListener("click", () => { openRatePanel(false); $("#close-panel").scrollIntoView({ block: "nearest" }); });
$("#cancel-close").addEventListener("click", () => $("#close-panel").classList.add("hidden"));
document.querySelectorAll(".rate-btn").forEach(b => b.addEventListener("click", () => {
  pendingRating = Number(b.dataset.rate);
  document.querySelectorAll(".rate-btn").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
}));
$("#confirm-close").addEventListener("click", async () => {
  const rateOnly = $("#close-panel").dataset.mode === "rate";
  if (rateOnly && !pendingRating) return showMessage(notice, t("err.rate"), true);
  const patch = {};
  if (!rateOnly) patch.status = "closed";
  if (pendingRating) Object.assign(patch, { rating: pendingRating, rating_comment: $("#rate-comment").value.trim() || null, rated_at: new Date().toISOString() });
  const btn = $("#confirm-close"); setBusy(btn, true, t("act.saving"));
  const { error } = await supabase.from("tickets").update(patch).eq("id", currentTicket.id);
  setBusy(btn, false);
  if (error) return showMessage(notice, friendlyError(error, "Could not update the request."), true);
  showMessage(notice, rateOnly ? t("ok.thanksFb") : t("ok.closed"));
  const { data: latest } = await supabase.from("tickets").select("*").eq("id", currentTicket.id).single();
  await loadTickets(); if (latest) await openTicket(latest, false);
});

// ---- Live updates + browser notifications
setupBell($("#bell"));
let unread = 0; const baseTitle = document.title;
addEventListener("focus", () => { unread = 0; document.title = baseTitle; });
async function refreshThread() {
  if (!currentTicket) return;
  const { data } = await supabase.from("ticket_messages").select("id,sender_id,body,attachment_path,created_at,is_staff").eq("ticket_id", currentTicket.id).order("created_at");
  currentMessages = data || []; await renderMessages(currentTicket, currentMessages);
  const th = $("#thread"); th.scrollTop = th.scrollHeight;
}
if (user && supabase) listen(supabase, "player-live", {
  onState: liveBadge($("#live")),
  onMessage: async m => {
    if (m.sender_id === user.id) return;
    const viewing = m.ticket_id === selectedTicket;
    if (viewing) await refreshThread();
    await loadTickets();
    if (!m.is_staff) return;
    const tk = ticketsCache.find(x => x.id === m.ticket_id), subject = tk?.subject || "…", watching = viewing && document.hasFocus();
    chime();
    if (watching) return;
    unread++; document.title = "(" + unread + ") " + baseTitle;
    showMessage(notice, t("notif.in", { s: subject }));
    notify(t("notif.reply"), subject, () => tk && openTicket(tk));
  },
  onTicket: async p => {
    if (p.eventType === "DELETE" || !p.new) return;
    await loadTickets();
    if (p.new.id === selectedTicket && currentTicket && (p.new.status !== currentTicket.status || p.new.rating !== currentTicket.rating)) {
      const { data } = await supabase.from("tickets").select("*").eq("id", p.new.id).single(); if (data) await openTicket(data, false);
    }
  }
});

// Refresh article suggestions as the player types (must come after newForm is defined)
{ let timer; newForm.addEventListener("input", () => { clearTimeout(timer); timer = setTimeout(runSuggest, 350); }); }

window.addEventListener("prefs-applied", () => { document.querySelectorAll(".formatted-date[data-timestamp]").forEach(el => { el.textContent = formatDate(el.dataset.timestamp); }); });
