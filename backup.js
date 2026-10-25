// One-click full backup (admin). Pages through Supabase's 1000-row limit so nothing is cut off.
async function fetchAll(supabase, table) {
  const out = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase.from(table).select("*").order("created_at", { ascending: true }).order("id").range(from, from + 999);
    if (error) throw error;
    out.push(...data); if (data.length < 1000) break;
  }
  return out;
}
const save = (name, text, type) => {
  const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(new Blob([text], { type })), download: name });
  document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
};
// Spreadsheet-safe cell: quotes as needed and defuses cells that would run as formulas.
const cell = v => { let s = v == null ? "" : String(v); if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
export async function exportAll(supabase, format, progress = () => {}) {
  progress("Fetching tickets…"); const tickets = await fetchAll(supabase, "tickets");
  progress("Fetching messages… (" + tickets.length + " tickets)"); const messages = await fetchAll(supabase, "ticket_messages");
  const by = new Map(); messages.forEach(m => (by.get(m.ticket_id) || by.set(m.ticket_id, []).get(m.ticket_id)).push(m));
  const day = new Date().toISOString().slice(0, 10);
  if (format === "json") {
    save(`mirage-support-backup-${day}.json`, JSON.stringify({ exported_at: new Date().toISOString(), tickets: tickets.map(t => ({ ...t, messages: by.get(t.id) || [] })) }, null, 2), "application/json");
  } else {
    const cols = ["ticket_number", "ticket_id", "subject", "category", "status", "priority", "tags", "assigned_to", "requester", "ticket_created", "ticket_updated", "rating", "rating_comment", "message_id", "message_time", "sender", "message", "attachment_file"];
    const rows = [cols.join(",")];
    for (const t of tickets) for (const m of (by.get(t.id)?.length ? by.get(t.id) : [null]))
      rows.push([t.ticket_number, t.id, t.subject, t.category, t.status, t.priority, (t.tags || []).join(";"), t.assigned_name, t.requester_name, t.created_at, t.updated_at, t.rating, t.rating_comment,
        m?.id, m?.created_at, m ? (m.is_staff ? "Staff" : "Player") : "", m?.body, m?.attachment_path ? m.attachment_path.split("/").pop() : ""].map(cell).join(","));
    save(`mirage-support-backup-${day}.csv`, "\ufeff" + rows.join("\r\n"), "text/csv;charset=utf-8");
  }
  progress("Done: " + tickets.length + " tickets, " + messages.length + " messages.");
}
