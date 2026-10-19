import { supabase, requireUser, isStaff, showMessage, escapeHtml, formatDate, signOut } from "./supabase.js";
const notice=document.querySelector("#notice"), list=document.querySelector("#ticket-list"), detail=document.querySelector("#ticket-detail");
let user, selected=null, tickets=[];
document.querySelector("#signout").addEventListener("click",signOut);
document.querySelector("#refresh").addEventListener("click",loadTickets);
document.querySelector("#filter").addEventListener("change",renderList);
user=await requireUser();
if(user && supabase){ if(!await isStaff(user.id)){location.replace("dashboard.html");} else await loadTickets(); }

async function loadTickets(){
 const {data,error}=await supabase.from("tickets").select("id,subject,category,status,created_by,created_at,updated_at").order("updated_at",{ascending:false});
 if(error)return showMessage(notice,error.message,true);
 tickets=data||[];renderList();
}
function renderList(){
 const filter=document.querySelector("#filter").value;
 list.replaceChildren();
 const filtered=tickets.filter(t=>filter==="all"||t.status===filter);
 if(!filtered.length){list.innerHTML='<p class="empty">No tickets in this view.</p>';return;}
 filtered.forEach(t=>{
  const b=document.createElement("button");b.className="ticket-item"+(selected===t.id?" selected":"");
  b.innerHTML='<strong></strong><span class="ticket-meta"></span>';
  b.querySelector("strong").textContent=t.subject;
  b.querySelector(".ticket-meta").innerHTML='<span class="status '+escapeHtml(t.status)+'">'+escapeHtml(t.status.replace("_"," "))+'</span><span>'+escapeHtml(t.category)+'</span><span>'+escapeHtml(formatDate(t.updated_at))+'</span>';
  b.addEventListener("click",()=>openTicket(t));list.append(b);
 });
}
async function openTicket(ticket){
 selected=ticket.id;
 const {data:msgs,error}=await supabase.from("ticket_messages").select("id,sender_id,body,attachment_path,created_at").eq("ticket_id",ticket.id).order("created_at");
 if(error)return showMessage(notice,error.message,true);
 detail.replaceChildren();
 const head=document.createElement("div");head.className="page-heading";
 const title=document.createElement("div");title.innerHTML='<p class="eyebrow">TICKET CONVERSATION</p><h1 style="font-size:25px"></h1><p class="small"></p>';
 title.querySelector("h1").textContent=ticket.subject;title.querySelector("p.small").textContent=ticket.category+" · "+formatDate(ticket.created_at);
 head.append(title);detail.append(head);
 const meta=document.createElement("p");meta.className="small";meta.textContent="Player user ID: "+ticket.created_by;detail.append(meta);
 const statusRow=document.createElement("div");statusRow.className="row";
 const statusLabel=document.createElement("label");statusLabel.className="small";statusLabel.textContent="Ticket status";
 const select=document.createElement("select");select.className="field";select.style.flex="1";select.innerHTML='<option value="open">Open</option><option value="in_progress">In progress</option><option value="closed">Closed</option>';select.value=ticket.status;
 const update=document.createElement("button");update.className="button primary";update.textContent="Update status";
 update.addEventListener("click",async()=>{const {error}=await supabase.from("tickets").update({status:select.value}).eq("id",ticket.id);if(error)return showMessage(notice,error.message,true);showMessage(notice,"Ticket status updated.");await loadTickets();});
 statusRow.append(statusLabel,select,update);detail.append(statusRow);
 const thread=document.createElement("div");thread.className="thread";
 for(const m of msgs||[]){
  const item=document.createElement("article");item.className="message"+(await isStaff(m.sender_id)?" staff":"");
  const mh=document.createElement("div");mh.className="message-head";
  const who=document.createElement("span");who.textContent=m.sender_id===user.id?"You (staff)":"Player / staff member";
  const when=document.createElement("span");when.textContent=formatDate(m.created_at);mh.append(who,when);
  const body=document.createElement("div");body.className="message-body";body.textContent=m.body||"";item.append(mh,body);
  if(m.attachment_path){const {data}=await supabase.storage.from("ticket-attachments").createSignedUrl(m.attachment_path,60);if(data?.signedUrl){const a=document.createElement("a");a.href=data.signedUrl;a.target="_blank";a.rel="noopener";a.textContent="View attached image";a.className="text-link";item.append(document.createElement("br"),a);}}
  thread.append(item);
 }
 if(!msgs?.length)thread.innerHTML='<p class="empty">No messages yet.</p>';
 detail.append(thread);
 const form=document.createElement("form");form.className="stack";form.innerHTML='<label>Reply to player<textarea class="field" name="body" maxlength="5000" required placeholder="Write a helpful response…"></textarea></label><label>Attach an image (optional)<input class="file-input" name="attachment" type="file" accept="image/png,image/jpeg,image/webp,image/gif"></label><p class="small">Images only, maximum 5 MB.</p><button class="button primary" type="submit">Send reply →</button>';
 form.addEventListener("submit",async e=>{
  e.preventDefault();const fd=new FormData(form),body=String(fd.get("body")).trim(),file=fd.get("attachment");
  if(file instanceof File&&file.size&&(!file.type.startsWith("image/")||file.size>5*1024*1024))return showMessage(notice,"Choose an image no larger than 5 MB.",true);
  let attachment_path=null;
  if(file instanceof File&&file.size){attachment_path=ticket.id+"/"+user.id+"/"+crypto.randomUUID()+"-"+file.name.replace(/[^a-zA-Z0-9._-]/g,"_").slice(-100);const {error}=await supabase.storage.from("ticket-attachments").upload(attachment_path,file,{upsert:false,contentType:file.type});if(error)return showMessage(notice,error.message,true);}
  const {error}=await supabase.from("ticket_messages").insert({ticket_id:ticket.id,sender_id:user.id,body,attachment_path});
  if(error)return showMessage(notice,error.message,true);
  if(ticket.status==="closed"){const {error:statusError}=await supabase.from("tickets").update({status:"open"}).eq("id",ticket.id);if(statusError)return showMessage(notice,"Reply sent, but status update failed: "+statusError.message,true);}
  showMessage(notice,"Reply sent.");await loadTickets();const latest=tickets.find(t=>t.id===ticket.id);if(latest)await openTicket(latest);
 });
 detail.append(form);renderList();
}