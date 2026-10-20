import { supabase, requireUser, isStaff, showMessage, escapeHtml, formatDate, signOut } from "./supabase.js";

const $ = (selector) => document.querySelector(selector);
const notice = $("#notice"), list = $("#ticket-list"), detail = $("#ticket-detail");
let user = null, selectedTicket = null, staff = false, busy = false;

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
  if (!["image/png","image/jpeg","image/webp","image/gif"].includes(file.type)) return "Please choose a PNG, JPG, WEBP or GIF image.";
  if (file.size > 5 * 1024 * 1024) return "Images must be 5 MB or smaller.";
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
  status.textContent = ticket.status.replaceAll("_", " ");
  const category = document.createElement("span");
  category.textContent = ticket.category;
  const updated = document.createElement("span");
  updated.textContent = formatDate(ticket.updated_at);
  meta.append(status, category, updated);
  button.append(title, meta);
  button.addEventListener("click", () => openTicket(ticket));
  return button;
}

async function loadTickets() {
  if (!supabase || !list) return;
  list.innerHTML = '<p class="empty">Loading your requests…</p>';
  const { data, error } = await supabase.from("tickets")
    .select("id,subject,category,status,created_at,updated_at")
    .order("updated_at", { ascending: false });
  if (error) {
    list.innerHTML = '<p class="empty">Unable to load tickets.</p>';
    showMessage(notice, friendlyError(error, "Tickets could not be loaded."), true);
    return;
  }
  list.replaceChildren();
  if (!data?.length) {
    list.innerHTML = '<div class="empty"><strong>No requests yet</strong><br>Your support history will appear here after you send your first ticket.</div>';
    return;
  }
  data.forEach(ticket => list.append(renderTicket(ticket)));
}

wireImagePreview($("#new-ticket")?.querySelector('input[name="attachment"]'));
wireImagePreview($("#reply-form")?.querySelector('input[name="attachment"]'));

function wireImagePreview(input) {
  if (!input) return;
  const preview = document.createElement("div"); preview.className = "attachment-preview-wrap"; preview.setAttribute("aria-live", "polite");
  input.closest("label")?.insertAdjacentElement("afterend", preview);
  let objectUrl = null;
  input.addEventListener("change", () => {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    objectUrl = null; preview.replaceChildren();
    const file = input.files?.[0];
    if (!file) return;
    const problem = validateImage(file);
    if (problem) { const note = document.createElement("p"); note.className = "small"; note.textContent = problem; preview.append(note); return; }
    objectUrl = URL.createObjectURL(file);
    const img = document.createElement("img"); img.src = objectUrl; img.alt = "Selected image preview"; img.className = "attachment-preview";
    const name = document.createElement("p"); name.className = "small"; name.textContent = file.name + " · " + (file.size / 1024 / 1024).toFixed(2) + " MB";
    preview.append(img, name);
  });
}

$("#new-ticket")?.addEventListener("submit", async event => {
  event.preventDefault();
  if (busy) return;
  const form = event.currentTarget;
  const submit = form.querySelector('button[type="submit"]');
  const values = new FormData(form);
  const subject = String(values.get("subject") || "").trim();
  const body = String(values.get("body") || "").trim();
  const file = values.get("attachment");
  const category = String(values.get("category") || "General Support");
  if (subject.length < 3) return showMessage(notice, "Add a subject with at least 3 characters.", true);
  if (!body) return showMessage(notice, "Tell us what happened before submitting your ticket.", true);
  const fileProblem = validateImage(file);
  if (fileProblem) return showMessage(notice, fileProblem, true);
  busy = true; setBusy(submit, true, "Creating request…");
  let ticket = null, attachmentPath = null;
  try {
    const requester_name = user.user_metadata?.username || user.user_metadata?.full_name || user.email;
    const cols = "id,subject,category,status,created_at,updated_at";
    let result = await supabase.from("tickets").insert({ created_by: user.id, subject, category, requester_name }).select(cols).single();
    if (result.error && /requester_name/.test(result.error.message)) // migration not applied yet
      result = await supabase.from("tickets").insert({ created_by: user.id, subject, category }).select(cols).single();
    if (result.error) throw result.error;
    ticket = result.data;
    attachmentPath = await uploadAttachment(file, ticket.id);
    const { error: messageError } = await supabase.from("ticket_messages").insert({
      ticket_id: ticket.id, sender_id: user.id, body, attachment_path: attachmentPath
    });
    if (messageError) {
      showMessage(notice, "Your ticket was created, but its first message failed to save. Please retry in this ticket or contact support. " + friendlyError(messageError), true);
      await loadTickets();
      return;
    }
    form.reset();
    selectedTicket = ticket.id;
    showMessage(notice, "Your support request has been created.");
    await loadTickets();
    await openTicket(ticket, false);
  } catch (error) {
    const message = ticket
      ? "Your ticket record was created, but its message or image could not be saved. Check the error below, then open the ticket and retry. "
      : "We could not create your ticket. Please try again. ";
    showMessage(notice, message + friendlyError(error), true);
    if (ticket) await loadTickets();
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
    const fromStaff = await isStaff(message.sender_id);
    const item = document.createElement("article");
    item.className = "message" + (fromStaff ? " staff" : "");
    const head = document.createElement("div");
    head.className = "message-head";
    const author = document.createElement("strong");
    author.textContent = message.sender_id === user.id ? (staff ? "You (staff)" : "You") : (fromStaff ? "Staff" : "Ticket participant");
    const date = document.createElement("span");
    date.textContent = formatDate(message.created_at);
    head.append(author, date);
    const body = document.createElement("div");
    body.className = "message-body";
    body.textContent = message.body || (message.attachment_path ? "Attached an image" : "");
    item.append(head, body);
    if (message.attachment_path) {
      const { data, error } = await supabase.storage.from("ticket-attachments").createSignedUrl(message.attachment_path, 300);
      if (!error && data?.signedUrl) {
        const link = document.createElement("a");
        link.href = data.signedUrl; link.target = "_blank"; link.rel = "noopener noreferrer";
        link.textContent = "Open full image ↗"; link.className = "text-link attachment-link";
        const preview = document.createElement("img"); preview.src = data.signedUrl; preview.alt = "Ticket attachment preview"; preview.className = "attachment-preview"; preview.loading = "lazy";
        item.append(preview, link);
      } else {
        const note = document.createElement("p"); note.className = "small"; note.textContent = "Attachment is currently unavailable."; item.append(note);
      }
    }
    thread.append(item);
  }
}

async function openTicket(ticket, shouldScroll = true) {
  selectedTicket = ticket.id;
  detail.classList.remove("hidden");
  $("#ticket-title").textContent = ticket.subject;
  $("#ticket-info").textContent = ticket.category + " · Created " + formatDate(ticket.created_at);
  const status = $("#ticket-status");
  status.textContent = ticket.status.replaceAll("_", " ");
  status.className = "status " + ticket.status;
  $("#thread").innerHTML = '<p class="empty">Loading conversation…</p>';
  const { data: messages, error } = await supabase.from("ticket_messages")
    .select("id,sender_id,body,attachment_path,created_at")
    .eq("ticket_id", ticket.id).order("created_at", { ascending: true });
  if (error) {
    showMessage(notice, friendlyError(error, "This conversation could not be loaded."), true);
    $("#thread").innerHTML = '<p class="empty">Conversation unavailable.</p>';
    return;
  }
  await renderMessages(ticket, messages || []);
  const closed = ticket.status === "closed";
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
  if (!body && !(file instanceof File && file.size)) return showMessage(notice, "Write a reply or attach an image.", true);
  const fileProblem = validateImage(file);
  if (fileProblem) return showMessage(notice, fileProblem, true);
  busy = true; setBusy(submit, true, "Sending reply…");
  try {
    const { data: ticket, error: ticketError } = await supabase.from("tickets")
      .select("id,status").eq("id", selectedTicket).single();
    if (ticketError) throw ticketError;
    if (ticket.status === "closed" && !staff) throw new Error("This ticket is closed. Open a new request if you still need help.");
    const attachmentPath = await uploadAttachment(file, selectedTicket);
    const { error } = await supabase.from("ticket_messages").insert({
      ticket_id: selectedTicket, sender_id: user.id, body, attachment_path: attachmentPath
    });
    if (error) throw error;
    form.reset();
    showMessage(notice, "Reply sent successfully.");
    const { data: latest, error: latestError } = await supabase.from("tickets")
      .select("id,subject,category,status,created_at,updated_at").eq("id", selectedTicket).single();
    if (latestError) throw latestError;
    await loadTickets();
    await openTicket(latest, false);
  } catch (error) {
    showMessage(notice, friendlyError(error, "Your reply could not be sent. Please try again."), true);
  } finally {
    busy = false; setBusy(submit, false);
  }
});
