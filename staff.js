import { supabase, requireUser, isStaff, showMessage, formatDate, signOut } from "./supabase.js";
const $ = selector => document.querySelector(selector);
const notice = $("#notice"), list = $("#ticket-list"), detail = $("#ticket-detail");
let user = null, selected = null, tickets = [], busy = false;

$("#signout")?.addEventListener("click", signOut);
$("#refresh")?.addEventListener("click", loadTickets);
$("#filter")?.addEventListener("change", renderList);

try {
  user = await requireUser();
  if (user && supabase) {
    if (!await isStaff(user.id)) location.replace("/dashboard/");
    else await loadTickets();
  }
} catch (error) { showMessage(notice, friendly(error), true); }

function friendly(error) {
  const message = String(error?.message || error || "Unknown error");
  if (/row-level security|permission denied|not allowed/i.test(message)) return "The database denied this staff action. Check staff membership and Supabase policies. Details: " + message;
  if (/does not exist|schema cache|could not find the table/i.test(message)) return "A support table or column is missing. Check the setup SQL. Details: " + message;
  return message;
}
function busyButton(button, state, label) {
  if (!button) return;
  button.disabled = state;
  if (state) { button.dataset.originalText = button.textContent; button.textContent = label || "Working…"; }
  else if (button.dataset.originalText) { button.textContent = button.dataset.originalText; delete button.dataset.originalText; }
}
function validateFile(file) {
  if (!(file instanceof File) || !file.size) return "";
  if (!["image/png","image/jpeg","image/webp","image/gif"].includes(file.type)) return "Choose a PNG, JPG, WEBP or GIF image.";
  if (file.size > 5*1024*1024) return "Images must be 5 MB or smaller.";
  return "";
}
async function uploadFile(file, ticketId) {
  if (!(file instanceof File) || !file.size) return null;
  const problem = validateFile(file); if (problem) throw new Error(problem);
  const name = file.name.replace(/[^a-zA-Z0-9._-]/g,"_").slice(-100) || "attachment";
  const path = ticketId + "/" + user.id + "/" + crypto.randomUUID() + "-" + name;
  const {error} = await supabase.storage.from("ticket-attachments").upload(path,file,{upsert:false,contentType:file.type});
  if (error) throw error;
  return path;
}
async function loadTickets() {
  list.innerHTML = '<p class="empty">Refreshing the support queue…</p>';
  const {data,error}=await supabase.from("tickets").select("id,subject,category,status,created_by,created_at,updated_at").order("updated_at",{ascending:false});
  if(error){list.innerHTML='<p class="empty">Queue unavailable.</p>';return showMessage(notice,friendly(error),true);}
  tickets=data||[];renderList();
}
function renderList() {
  const filter=$("#filter").value, filtered=tickets.filter(t=>filter==="all"||t.status===filter);
  list.replaceChildren();
  if(!filtered.length){list.innerHTML='<p class="empty">No tickets in this view.</p>';return;}
  for(const ticket of filtered){
    const button=document.createElement("button");button.type="button";button.className="ticket-item"+(selected===ticket.id?" selected":"");
    const title=document.createElement("strong");title.textContent=ticket.subject;
    const meta=document.createElement("span");meta.className="ticket-meta";
    const status=document.createElement("span");status.className="status "+ticket.status;status.textContent=ticket.status.replaceAll("_"," ");
    const category=document.createElement("span");category.textContent=ticket.category;
    const date=document.createElement("span");date.textContent=formatDate(ticket.updated_at);
    meta.append(status,category,date);button.append(title,meta);button.addEventListener("click",()=>openTicket(ticket));list.append(button);
  }
}
async function openTicket(ticket) {
  selected=ticket.id;detail.replaceChildren();
  const heading=document.createElement("div");heading.className="page-heading";
  const headingText=document.createElement("div");headingText.innerHTML='<p class="eyebrow">TICKET CONVERSATION</p><h1 style="font-size:25px"></h1><p class="small"></p>';
  headingText.querySelector("h1").textContent=ticket.subject;
  headingText.querySelector("p.small").textContent=ticket.category+" · Created "+formatDate(ticket.created_at);
  heading.append(headingText);detail.append(heading);
  const statusRow=document.createElement("div");statusRow.className="row";statusRow.style.marginBottom="16px";
  const label=document.createElement("label");label.className="small";label.textContent="Ticket status";
  const select=document.createElement("select");select.className="field";select.style.flex="1";
  select.innerHTML='<option value="open">Open</option><option value="in_progress">In progress</option><option value="closed">Closed</option>';select.value=ticket.status;
  const update=document.createElement("button");update.type="button";update.className="button primary";update.textContent="Save status";
  update.addEventListener("click",async()=>{
    busyButton(update,true,"Saving…");
    const {error}=await supabase.from("tickets").update({status:select.value}).eq("id",ticket.id);
    busyButton(update,false);
    if(error)return showMessage(notice,friendly(error),true);
    showMessage(notice,"Ticket status updated.");
    await loadTickets();
    const current=tickets.find(t=>t.id===ticket.id);if(current)await openTicket(current);
  });
  statusRow.append(label,select,update);detail.append(statusRow);
  const thread=document.createElement("div");thread.className="thread";thread.innerHTML='<p class="empty">Loading conversation…</p>';detail.append(thread);
  const {data:messages,error}=await supabase.from("ticket_messages").select("id,sender_id,body,attachment_path,created_at").eq("ticket_id",ticket.id).order("created_at");
  if(error){thread.innerHTML='<p class="empty">Conversation unavailable.</p>';return showMessage(notice,friendly(error),true);}
  thread.replaceChildren();
  for(const message of messages||[]){
    const fromStaff=await isStaff(message.sender_id);
    const item=document.createElement("article");item.className="message"+(fromStaff?" staff":"");
    const mh=document.createElement("div");mh.className="message-head";
    const who=document.createElement("strong");who.textContent=message.sender_id===user.id?"You (staff)":(fromStaff?"Mirage Support Team":"Player");
    const when=document.createElement("span");when.textContent=formatDate(message.created_at);mh.append(who,when);
    const body=document.createElement("div");body.className="message-body";body.textContent=message.body||"Attached an image";item.append(mh,body);
    if(message.attachment_path){
      const {data}=await supabase.storage.from("ticket-attachments").createSignedUrl(message.attachment_path,300);
      if(data?.signedUrl){const a=document.createElement("a");a.href=data.signedUrl;a.target="_blank";a.rel="noopener noreferrer";a.className="text-link attachment-link";a.textContent="View attachment ↗";item.append(a);}
      else {const p=document.createElement("p");p.className="small";p.textContent="Attachment unavailable.";item.append(p);}
    }
    thread.append(item);
  }
  if(!messages?.length)thread.innerHTML='<p class="empty">No messages have been sent yet.</p>';
  const form=document.createElement("form");form.className="stack";
  form.innerHTML='<label>Reply to player<textarea class="field" name="body" maxlength="5000" placeholder="Write a clear, helpful response…"></textarea></label><label>Attach an image (optional)<input class="file-input" name="attachment" type="file" accept="image/png,image/jpeg,image/webp,image/gif"></label><p class="small">PNG, JPG, WEBP or GIF · max 5 MB. You can send an attachment without text.</p><button class="button primary" type="submit">Send reply ↗</button>';
  form.addEventListener("submit",async event=>{
    event.preventDefault();if(busy)return;
    const fd=new FormData(form),body=String(fd.get("body")||"").trim(),file=fd.get("attachment");
    if(!body&&!(file instanceof File&&file.size))return showMessage(notice,"Write a reply or attach an image.",true);
    const problem=validateFile(file);if(problem)return showMessage(notice,problem,true);
    busy=true;const submit=form.querySelector('button[type="submit"]');busyButton(submit,true,"Sending…");
    try{
      const attachment_path=await uploadFile(file,ticket.id);
      const {error}=await supabase.from("ticket_messages").insert({ticket_id:ticket.id,sender_id:user.id,body,attachment_path});
      if(error)throw error;
      if(ticket.status==="closed"){
        const {error:statusError}=await supabase.from("tickets").update({status:"open"}).eq("id",ticket.id);
        if(statusError)throw new Error("Reply sent, but ticket could not be reopened: "+statusError.message);
      }
      form.reset();showMessage(notice,"Reply sent successfully.");await loadTickets();
      const current=tickets.find(t=>t.id===ticket.id);if(current)await openTicket(current);
    }catch(error){showMessage(notice,friendly(error),true);}
    finally{busy=false;busyButton(submit,false);}
  });
  detail.append(form);renderList();
}
