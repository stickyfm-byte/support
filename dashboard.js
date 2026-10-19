import { supabase, requireUser, isStaff, showMessage, escapeHtml, formatDate, signOut } from "./supabase.js";
const notice = document.querySelector("#notice");
const list = document.querySelector("#ticket-list");
const detail = document.querySelector("#ticket-detail");
let user, selectedTicket = null, staff = false;

document.querySelector("#signout").addEventListener("click", signOut);
user = await requireUser();
if (user && supabase) {
  document.querySelector("#user-label").textContent = user.email || "Signed in with Discord";
  staff = await isStaff(user.id);
  if (staff) document.querySelector("#staff-link").classList.remove("hidden");
  await loadTickets();
}

async function loadTickets() {
  const { data, error } = await supabase.from("tickets").select("id,subject,category,status,created_at,updated_at").order("updated_at", {ascending:false});
  if (error) return showMessage(notice, error.message, true);
  list.replaceChildren();
  if (!data?.length) { list.innerHTML = '<p class="empty">No tickets yet.<br>Create one to get started.</p>'; return; }
  data.forEach(ticket => {
    const button = document.createElement("button");
    button.className = "ticket-item" + (selectedTicket === ticket.id ? " selected" : "");
    button.innerHTML = '<strong></strong><span class="ticket-meta"></span>';
    button.querySelector("strong").textContent = ticket.subject;
    button.querySelector(".ticket-meta").innerHTML = '<span class="status '+escapeHtml(ticket.status)+'">'+escapeHtml(ticket.status.replace("_"," "))+'</span><span>'+escapeHtml(ticket.category)+'</span><span>'+escapeHtml(formatDate(ticket.updated_at))+'</span>';
    button.addEventListener("click", () => openTicket(ticket));
    list.append(button);
  });
}

document.querySelector("#new-ticket").addEventListener("submit", async event => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const subject = String(form.get("subject")).trim();
  const body = String(form.get("body")).trim();
  const file = form.get("attachment");
  if (!subject || !body) return showMessage(notice, "Please enter a subject and message.", true);
  if (file instanceof File && file.size && (!["image/png","image/jpeg","image/webp","image/gif"].includes(file.type) || file.size > 5*1024*1024)) return showMessage(notice, "Choose a PNG, JPG, WEBP or GIF image no larger than 5 MB.", true);
  const submit = event.currentTarget.querySelector('button[type="submit"]');
  submit.disabled = true;
  const { data: ticket, error } = await supabase.from("tickets").insert({
    created_by: user.id, subject, category: form.get("category")
  }).select().single();
  if (error) { submit.disabled = false; return showMessage(notice, error.message, true); }
  let attachment_path = null;
  let uploadWarning = "";
  if (file instanceof File && file.size) {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g,"_").slice(-100);
    const objectPath = ticket.id + "/" + user.id + "/" + crypto.randomUUID() + "-" + safeName;
    const { error: uploadError } = await supabase.storage.from("ticket-attachments").upload(objectPath, file, {upsert:false, contentType:file.type});
    if (uploadError) uploadWarning = " The image could not be uploaded (" + uploadError.message + "), but your message will still be sent.";
    else attachment_path = objectPath;
  }
  const { error: msgError } = await supabase.from("ticket_messages").insert({ticket_id:ticket.id, sender_id:user.id, body, attachment_path});
  submit.disabled = false;
  if (msgError) return showMessage(notice, "Ticket created, but the first message failed: " + msgError.message, true);
  event.currentTarget.reset();
  showMessage(notice, "Ticket created successfully." + uploadWarning, Boolean(uploadWarning));
  selectedTicket = ticket.id;
  await loadTickets();
  await openTicket(ticket);
});

async function openTicket(ticket) {
  selectedTicket = ticket.id;
  detail.classList.remove("hidden");
  document.querySelector("#ticket-title").textContent = ticket.subject;
  document.querySelector("#ticket-info").textContent = ticket.category + " · Opened " + formatDate(ticket.created_at);
  const status = document.querySelector("#ticket-status");
  status.textContent = ticket.status.replace("_"," ");
  status.className = "status " + ticket.status;
  const { data: messages, error } = await supabase.from("ticket_messages").select("id,sender_id,body,attachment_path,created_at").eq("ticket_id",ticket.id).order("created_at");
  const thread = document.querySelector("#thread");
  thread.replaceChildren();
  if (error) return showMessage(notice, error.message, true);
  for (const message of messages || []) {
    const item = document.createElement("article");
    item.className = "message" + (await isStaff(message.sender_id) ? " staff" : "");
    item.innerHTML = '<div class="message-head"><span></span><span></span></div><div class="message-body"></div>';
    item.querySelector(".message-head span:first-child").textContent = message.sender_id === user.id ? "You" : "MirageSMP Support";
    item.querySelector(".message-head span:last-child").textContent = formatDate(message.created_at);
    item.querySelector(".message-body").textContent = message.body || "";
    if (message.attachment_path) {
      const { data } = await supabase.storage.from("ticket-attachments").createSignedUrl(message.attachment_path, 60);
      if (data?.signedUrl) {
        const link = document.createElement("a"); link.href = data.signedUrl; link.target="_blank"; link.rel="noopener"; link.textContent="View attached image"; link.className="text-link";
        item.append(document.createElement("br"), link);
      }
    }
    thread.append(item);
  }
  if (!messages?.length) thread.innerHTML = '<p class="empty">No replies yet.</p>';
  const closed = ticket.status === "closed";
  document.querySelector("#reply-form").classList.toggle("hidden", closed);
  await loadTickets();
  detail.scrollIntoView({behavior:"smooth",block:"start"});
}

document.querySelector("#reply-form").addEventListener("submit", async event => {
  event.preventDefault();
  if (!selectedTicket) return;
  const form = new FormData(event.currentTarget);
  const body = String(form.get("body")).trim();
  const file = form.get("attachment");
  if (!body && !(file instanceof File && file.size)) return showMessage(notice, "Write a reply or attach an image.", true);
  if (file instanceof File && file.size) {
    if (!file.type.startsWith("image/") || file.size > 5*1024*1024) return showMessage(notice, "Choose an image no larger than 5 MB.", true);
  }
  let attachment_path = null;
  if (file instanceof File && file.size) {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g,"_").slice(-100);
    attachment_path = selectedTicket + "/" + user.id + "/" + crypto.randomUUID() + "-" + safeName;
    const { error } = await supabase.storage.from("ticket-attachments").upload(attachment_path,file,{upsert:false,contentType:file.type});
    if (error) return showMessage(notice, "Image upload failed: " + error.message, true);
  }
  const { error } = await supabase.from("ticket_messages").insert({ticket_id:selectedTicket,sender_id:user.id,body,attachment_path});
  if (error) return showMessage(notice, "Reply failed: " + error.message, true);
  event.currentTarget.reset();
  showMessage(notice,"Reply sent.");
  await loadTickets();
  const { data: ticket } = await supabase.from("tickets").select("id,subject,category,status,created_at,updated_at").eq("id",selectedTicket).single();
  if (ticket) await openTicket(ticket);
});