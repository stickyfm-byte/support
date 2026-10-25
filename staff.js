import { downloadTranscript } from "/transcript.js";
import { getPrefs, setPref, connectAccount, chime } from "/prefs.js";
import { listen, notify, setupBell, liveBadge } from "/live.js";
import { exportAll } from "/backup.js";
import { supabase, requireUser, isStaff, isAdmin, showMessage, formatDate, signOut } from "./supabase.js";
const $ = selector => document.querySelector(selector);
const notice = $("#notice"), list = $("#ticket-list"), detail = $("#ticket-detail");
let user = null, selected = null, tickets = [], busy = false, admin = false, ready = false, currentThread = null;

$("#signout")?.addEventListener("click", signOut);
$("#refresh")?.addEventListener("click", () => loadTickets());
$("#filter")?.addEventListener("change", renderList);

try {
  user = await requireUser();
  if (user && supabase) {
    if (!await isStaff(user.id)) location.replace("/dashboard/");
    else {
      admin = await isAdmin(); ready = true;
      if ($("#filter")) $("#filter").value = getPrefs().queue || "all";
      if (admin) $("#admin-tools").hidden = false;
      await loadTickets();
    }
  }
} catch (error) { showMessage(notice, friendly(error), true); }

$("#grant-staff-form")?.addEventListener("submit", async event => {
  event.preventDefault();
  if (!admin) return;
  const form = event.currentTarget, email = String(new FormData(form).get("email") || "").trim();
  const button = form.querySelector('button[type="submit"]');
  busyButton(button, true, "Granting…");
  const { error } = await supabase.rpc("admin_grant_support_staff", { target_email: email });
  busyButton(button, false);
  if (error) return showMessage(notice, friendly(error), true);
  form.reset();
  showMessage(notice, "Staff access granted to " + email + ".");
});
$("#revoke-staff-form")?.addEventListener("submit", async event => {
  event.preventDefault();
  if (!admin) return;
  const form = event.currentTarget, email = String(new FormData(form).get("email") || "").trim();
  if (!confirm("Revoke staff access for " + email + "?")) return;
  const button = form.querySelector('button[type="submit"]');
  busyButton(button, true, "Revoking…");
  const { error } = await supabase.rpc("admin_revoke_support_staff", { target_email: email });
  busyButton(button, false);
  if (error) return showMessage(notice, friendly(error), true);
  form.reset();
  showMessage(notice, "Staff access revoked for " + email + ".");
});

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
async function loadTickets(quiet) {
  if (!quiet) list.innerHTML = '<p class="empty">Refreshing the support queue…</p>';
  const {data,error}=await supabase.from("tickets").select("*").order("updated_at",{ascending:false});
  if(error){list.innerHTML='<p class="empty">Queue unavailable.</p>';return showMessage(notice,friendly(error),true);}
  tickets=data||[];renderList();
}
function renderList() {
  const counts={};tickets.forEach(t=>counts[t.created_by]=(counts[t.created_by]||0)+1);
  const filter=$("#filter").value, rank={urgent:3,high:2,normal:1,low:0};
  const match=t=>filter==="all"||t.status===filter||(filter==="mine"&&t.assigned_to===user.id)||(filter==="unassigned"&&!t.assigned_to&&t.status!=="closed")||(filter==="urgent"&&["high","urgent"].includes(t.priority)&&t.status!=="closed");
  const filtered=tickets.filter(match).sort((a,b)=>(a.status==="closed")-(b.status==="closed")||(rank[b.priority]||1)-(rank[a.priority]||1)||new Date(b.updated_at)-new Date(a.updated_at));
  list.replaceChildren();
  if(!filtered.length){list.innerHTML='<p class="empty">No tickets in this view.</p>';return;}
  for(const ticket of filtered){
    const button=document.createElement("button");button.type="button";button.className="ticket-item"+(selected===ticket.id?" selected":"");
    const title=document.createElement("strong");title.textContent=ticket.subject;
    const meta=document.createElement("span");meta.className="ticket-meta";
    const status=document.createElement("span");status.className="status "+ticket.status;status.textContent=ticket.status.replaceAll("_"," ");
    const category=document.createElement("span");category.textContent=(ticket.ticket_number?"#"+ticket.ticket_number+" · ":"")+(ticket.requester_name?ticket.requester_name+" · ":"")+ticket.category;
    const date=document.createElement("span");date.dataset.timestamp=ticket.updated_at;date.classList.add("formatted-date");date.textContent=formatDate(ticket.updated_at);
    meta.append(status);
    if(ticket.priority&&ticket.priority!=="normal"){const p=document.createElement("span");p.className="prio "+ticket.priority;p.textContent=ticket.priority;meta.append(p);}
    meta.append(category,date);
    if(counts[ticket.created_by]>1){const r=document.createElement("span");r.className="repeat";r.textContent="↻ "+counts[ticket.created_by]+" tickets";meta.append(r);}
    if(ticket.assigned_name){const a=document.createElement("span");a.textContent="👤 "+(ticket.assigned_to===user.id?"You":ticket.assigned_name);meta.append(a);}
    if(ticket.rating){const r=document.createElement("span");r.textContent=ticket.rating===1?"👍":"👎";r.setAttribute("aria-label",ticket.rating===1?"Rated helpful":"Rated not helpful");meta.append(r);}
    button.append(title,meta);
    if(ticket.tags?.length){const t=document.createElement("div");t.className="tags";ticket.tags.forEach(x=>{const c=document.createElement("span");c.className="tag";c.textContent=x;t.append(c);});button.append(t);}button.addEventListener("click",()=>openTicket(ticket));list.append(button);
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
  statusRow.append(label,select,update);
  {
    const remove = document.createElement("button");
    remove.type = "button"; remove.className = "button danger"; remove.textContent = "Delete ticket";
    remove.title = "Permanently delete this ticket (administrator permission required)";
    remove.addEventListener("click", async () => {
      if (!confirm("Permanently delete this ticket and its conversation? This cannot be undone.")) return;
      busyButton(remove, true, "Deleting…");
      const { data: deleted, error } = await supabase.rpc("admin_delete_support_ticket", { target_ticket_id: ticket.id });
      busyButton(remove, false);
      if (error) return showMessage(notice, "Ticket deletion failed. Your account may not have administrator permission, or the delete function may not be installed. Details: " + friendly(error), true);
      if (deleted !== true) return showMessage(notice, "The database did not delete this ticket. Confirm you are signed in with the primary administrator account and that ticket-delete-fix.sql has been applied.", true);
      selected = null; detail.innerHTML = '<p class="empty">Ticket deleted.</p>';
      showMessage(notice, "Ticket and conversation deleted.");
      await loadTickets();
    });
    statusRow.append(remove);
  }
  detail.append(statusRow);
  const save=async(patch,msg)=>{const {error}=await supabase.from("tickets").update(patch).eq("id",ticket.id);if(error)return showMessage(notice,friendly(error),true);showMessage(notice,msg);await loadTickets();const c=tickets.find(t=>t.id===ticket.id);if(c)await openTicket(c);};
  const ctl=document.createElement("div");ctl.className="staff-controls";
  const mine=ticket.assigned_to===user.id, myName=getPrefs().staffName||user.user_metadata?.username||user.user_metadata?.full_name||user.email||"Staff";
  const who=document.createElement("p");who.className="small";who.style.margin="0";who.textContent=ticket.assigned_name?"Assigned to "+(mine?"you":ticket.assigned_name):"Unassigned";
  const claim=document.createElement("button");claim.type="button";claim.className="button";claim.textContent=mine?"Unassign me":(ticket.assigned_to?"Take over":"Assign to me");
  claim.addEventListener("click",()=>save(mine?{assigned_to:null,assigned_name:null}:{assigned_to:user.id,assigned_name:prettifyDisplayName(getPrefs().staffName||myName)},mine?"Ticket unassigned.":"Ticket assigned to you."));
  const pl=document.createElement("label");pl.className="small";pl.textContent="Priority ";
  const pr=document.createElement("select");pr.className="field";pr.style.width="auto";pr.innerHTML='<option value="low">Low</option><option value="normal">Normal</option><option value="high">High</option><option value="urgent">Urgent</option>';pr.value=ticket.priority||"normal";
  pr.addEventListener("change",()=>save({priority:pr.value},"Priority set to "+pr.value+"."));
   const prioritySlider=document.createElement("input");prioritySlider.type="range";prioritySlider.min="0";prioritySlider.max="3";prioritySlider.step="1";prioritySlider.className="rng staff-priority-slider";prioritySlider.setAttribute("aria-label","Ticket priority level");prioritySlider.value=String(({low:0,normal:1,high:2,urgent:3})[ticket.priority||"normal"]);prioritySlider.style.setProperty("--pct",(Number(prioritySlider.value)/3*100)+"%");
   const priorityCaption=document.createElement("span");priorityCaption.className="small priority-caption";priorityCaption.textContent="Priority level: "+(ticket.priority||"normal");
   prioritySlider.addEventListener("input",()=>{const v=Number(prioritySlider.value);prioritySlider.style.setProperty("--pct",(v/3*100)+"%");priorityCaption.textContent="Priority level: "+(["low","normal","high","urgent"][v]);});
   prioritySlider.addEventListener("change",()=>{const v=["low","normal","high","urgent"][Number(prioritySlider.value)];pr.value=v;save({priority:v},"Priority set to "+v+".");});
   pl.append(pr);
  const tagBox=document.createElement("div");tagBox.className="tags";
  (ticket.tags||[]).forEach(t=>{const b=document.createElement("button");b.type="button";b.className="tag removable";b.textContent=t+" ×";b.setAttribute("aria-label","Remove tag "+t);b.addEventListener("click",()=>save({tags:ticket.tags.filter(x=>x!==t)},"Tag removed."));tagBox.append(b);});
  const tf=document.createElement("form");tf.className="row";tf.innerHTML='<label class="small" for="tag-in">Add tag</label><input id="tag-in" class="field" list="tag-presets" maxlength="24" style="width:150px" placeholder="e.g. needs-evidence"><datalist id="tag-presets"><option value="needs-evidence"><option value="ban-appeal"><option value="bug"><option value="account"><option value="follow-up"><option value="escalated"></datalist><button class="button" type="submit">Add</button>';
  tf.addEventListener("submit",e=>{e.preventDefault();const v=tf.querySelector("input").value.trim().toLowerCase().replace(/[^a-z0-9- ]/g,"").replace(/ +/g,"-").slice(0,24);if(!v)return;if((ticket.tags||[]).includes(v))return showMessage(notice,"That tag is already on this ticket.",true);if((ticket.tags||[]).length>=8)return showMessage(notice,"A ticket can have up to 8 tags.",true);save({tags:[...(ticket.tags||[]),v]},"Tag added.");});
  const r1=document.createElement("div");r1.className="row";r1.append(who,claim,pl);const priorityControl=document.createElement("div");priorityControl.className="priority-control";priorityControl.append(prioritySlider,priorityCaption);ctl.append(r1,priorityControl,tagBox,tf);
  if(ticket.rating){const rn=document.createElement("p");rn.className="small";rn.style.margin="0";rn.textContent="Player rated this "+(ticket.rating===1?"👍 helpful":"👎 not helpful")+(ticket.rating_comment?' — "'+ticket.rating_comment+'"':"");ctl.append(rn);}
  detail.append(ctl);
  const prior=tickets.filter(t=>t.created_by===ticket.created_by&&t.id!==ticket.id).sort((x,y)=>new Date(y.created_at)-new Date(x.created_at));
  if(prior.length){
    const box=document.createElement("details");box.className="history";box.open=true;
    const sum=document.createElement("summary");sum.append("Player history · "+prior.length+" earlier ticket"+(prior.length>1?"s":""));
    const same=prior.filter(t=>t.category===ticket.category).length;
    if(same&&["Appeal","Player report"].includes(ticket.category)){const f=document.createElement("span");f.className="flag";f.textContent=(ticket.category==="Appeal"?"Repeat appeal":"Repeat reporter")+" · "+same+" earlier";sum.append(f);}
    box.append(sum);
    prior.slice(0,12).forEach(t=>{const b=document.createElement("button");b.type="button";b.className="ticket-item";const st=document.createElement("strong");st.textContent=t.subject;const m=document.createElement("span");m.className="ticket-meta";
      const ss=document.createElement("span");ss.className="status "+t.status;ss.textContent=t.status.replaceAll("_"," ");const cc=document.createElement("span");cc.textContent=t.category;const dd=document.createElement("span");dd.textContent=formatDate(t.created_at);m.append(ss,cc,dd);
      if(t.rating){const r=document.createElement("span");r.textContent=t.rating===1?"👍":"👎";m.append(r);}
      b.append(st,m);b.addEventListener("click",()=>openTicket(t));box.append(b);});
    if(prior.length>12){const more=document.createElement("p");more.className="small";more.textContent="…and "+(prior.length-12)+" older.";box.append(more);}
    detail.append(box);
  }
  const thread=document.createElement("div");thread.className="thread";thread.innerHTML='<p class="empty">Loading conversation…</p>';detail.append(thread);currentThread=thread;
  const {data:messages,error}=await supabase.from("ticket_messages").select("id,sender_id,body,attachment_path,created_at,is_staff").eq("ticket_id",ticket.id).order("created_at");
  if(error){thread.innerHTML='<p class="empty">Conversation unavailable.</p>';return showMessage(notice,friendly(error),true);}
  thread.replaceChildren();
  for(const message of messages||[])thread.append(await buildMessage(ticket,message));
  if(!messages?.length)thread.innerHTML='<p class="empty">No messages have been sent yet.</p>';
  const copyId=document.createElement("button");copyId.type="button";copyId.className="button";copyId.textContent="Copy ticket ID";
   copyId.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(ticket.id);showMessage(notice,"Ticket ID copied.");}catch{showMessage(notice,"Could not copy the ticket ID in this browser.",true);}});
   statusRow.append(copyId);
   const quickStatus=document.createElement("button");quickStatus.type="button";quickStatus.className="button";quickStatus.textContent=ticket.status==="closed"?"Reopen ticket":"Close ticket";
   quickStatus.addEventListener("click",async()=>{const next=ticket.status==="closed"?"open":"closed";if(next==="closed"&&!confirm("Close this ticket?"))return;busyButton(quickStatus,true,next==="closed"?"Closing…":"Reopening…");const {error}=await supabase.from("tickets").update({status:next}).eq("id",ticket.id);busyButton(quickStatus,false);if(error)return showMessage(notice,friendly(error),true);showMessage(notice,next==="closed"?"Ticket closed.":"Ticket reopened.");await loadTickets();const current=tickets.find(t=>t.id===ticket.id);if(current)await openTicket(current);});
   statusRow.append(quickStatus);
   const exp=document.createElement("button");exp.type="button";exp.className="button";exp.textContent="Download transcript";
  exp.addEventListener("click",()=>downloadTranscript(ticket,messages||[],m=>m.is_staff?(m.sender_id===user.id?"You (Staff)":"Mirage Support Team (Staff)"):(ticket.requester_name||"Player")));statusRow.append(exp);
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
      const P=getPrefs(), disp=P.showName&&P.staffName?{sender_name:prettifyDisplayName(P.staffName),sender_badge:P.badge||null,sender_color:P.badgeColor}:{};
      let {error}=await supabase.from("ticket_messages").insert({ticket_id:ticket.id,sender_id:user.id,body,attachment_path,...disp});
      if(error&&/sender_/.test(error.message))({error}=await supabase.from("ticket_messages").insert({ticket_id:ticket.id,sender_id:user.id,body,attachment_path}));   // v4 SQL not applied yet
      if(error)throw error;
      if(P.autoClaim&&!ticket.assigned_to)await supabase.from("tickets").update({assigned_to:user.id,assigned_name:prettifyDisplayName(P.staffName||user.user_metadata?.username||"Staff")}).eq("id",ticket.id);
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

async function buildMessage(ticket,message){
    const fromStaff=message.is_staff;
    const item=document.createElement("article");item.className="message"+(fromStaff?" staff":"");
    const mh=document.createElement("div");mh.className="message-head";
    const who=document.createElement("strong");who.textContent=message.sender_id===user.id?"You (staff)":(fromStaff?(message.sender_name||"Mirage Support Team"):(ticket.requester_name||"Player"));
    if(fromStaff){const b=document.createElement("span");b.className="badge-staff"+(["cyan","violet","mint","rose","gold"].includes(message.sender_color)?" c-"+message.sender_color:"");b.textContent=message.sender_badge||"Staff";who.append(" ",b);}
    const when=document.createElement("span");when.dataset.timestamp=message.created_at;when.classList.add("formatted-date");when.textContent=formatDate(message.created_at);mh.append(who,when);
    const body=document.createElement("div");body.className="message-body";body.textContent=message.body||"Attached an image";item.append(mh,body);
    if(message.attachment_path){
      const {data}=await supabase.storage.from("ticket-attachments").createSignedUrl(message.attachment_path,300);
      if(data?.signedUrl){const a=document.createElement("a");a.href=data.signedUrl;a.target="_blank";a.rel="noopener noreferrer";a.className="text-link attachment-link";a.textContent="View attachment ↗";item.append(a);}
      else {const p=document.createElement("p");p.className="small";p.textContent="Attachment unavailable.";item.append(p);}
    }
    item.dataset.id=message.id;
    return item;
}

// ---- Backup (admin)
for (const fmt of ["json", "csv"]) $("#backup-" + fmt)?.addEventListener("click", async event => {
  const btn = event.currentTarget, status = $("#backup-status"); busyButton(btn, true, "Working…");
  try { await exportAll(supabase, fmt, text => status.textContent = text); } catch (error) { status.textContent = ""; showMessage(notice, friendly(error), true); }
  busyButton(btn, false);
});

// ---- Live updates + browser notifications
setupBell($("#bell"));
if (ready) listen(supabase, "staff-live", {
  onState: liveBadge($("#live")),
  onMessage: async m => {
    if (m.sender_id === user.id) return;
    let t = tickets.find(x => x.id === m.ticket_id);
    if (!t) { await loadTickets(true); t = tickets.find(x => x.id === m.ticket_id); }
    const watching = m.ticket_id === selected && currentThread?.isConnected;
    if (watching && !currentThread.querySelector('[data-id="' + m.id + '"]')) {
      currentThread.querySelector(".empty")?.remove();
      currentThread.append(await buildMessage(t || {}, m)); currentThread.scrollTop = currentThread.scrollHeight;
    }
    await loadTickets(true);
    if (!m.is_staff) chime();
    if (!m.is_staff && !(watching && document.hasFocus()))
      notify((t?.requester_name || "A player") + " replied", t?.subject || "", () => { const c = tickets.find(x => x.id === m.ticket_id); if (c) openTicket(c); });
  },
  onTicket: async p => {
    await loadTickets(true);
    if (p.eventType === "INSERT" && p.new.created_by !== user.id) chime();
    if (p.eventType === "INSERT" && p.new.created_by !== user.id)
      notify("New ticket: " + p.new.subject, (p.new.requester_name || "A player") + " · " + p.new.category, () => { const c = tickets.find(x => x.id === p.new.id); if (c) openTicket(c); });
  }
});

// ---- Quick display-name editor (also available, with badge options, in Settings)
let saveAccount = null;
const nameBtn = $("#name-btn"), namePanel = $("#name-panel"), nameInput = $("#name-input");
const prettifyDisplayName = value => String(value || "").trim()
  .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
  .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
  .replace(/[._-]+/g, " ").replace(/\s+/g, " ").trim();
const shownName = () => prettifyDisplayName(getPrefs().staffName || user?.user_metadata?.username || "Set display name");
const paintName = () => { if (nameBtn) nameBtn.textContent = "✎ " + shownName(); };
if (ready && nameBtn) {
  paintName();
  connectAccount(supabase, user).then(save => { saveAccount = save; paintName(); }).catch(() => {});
  const closeName = () => { namePanel.hidden = true; nameBtn.setAttribute("aria-expanded", "false"); };
  nameBtn.addEventListener("click", () => {
    const opening = namePanel.hidden; namePanel.hidden = !opening; nameBtn.setAttribute("aria-expanded", String(opening));
    if (opening) { nameInput.value = getPrefs().staffName || ""; nameInput.focus(); }
  });
  $("#name-cancel").addEventListener("click", () => { closeName(); nameBtn.focus(); });
  namePanel.addEventListener("submit", event => {
    event.preventDefault(); const v = nameInput.value.trim().slice(0, 40);
    setPref({ staffName: v }, saveAccount); paintName(); closeName();
    showMessage(notice, v ? "Display name updated to \u201c" + v + "\u201d." : "Display name cleared. Your username will be used instead.");
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !namePanel.hidden) { closeName(); nameBtn.focus(); } });
  document.addEventListener("click", e => { if (!namePanel.hidden && !e.target.closest(".name-edit")) closeName(); });
}

window.addEventListener("prefs-applied", () => { document.querySelectorAll(".formatted-date[data-timestamp]").forEach(el => { el.textContent = formatDate(el.dataset.timestamp); }); });
