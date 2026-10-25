// Plain-text transcript download, handy for appeals and report disputes.
export function downloadTranscript(ticket, messages, labelFor) {
  const iso = d => new Date(d).toISOString().replace("T", " ").slice(0, 19) + " UTC";
  const head = [
    "MIRAGE SUPPORT TRANSCRIPT", "",
    "Ticket:   " + (ticket.ticket_number ? "#" + ticket.ticket_number : ticket.id),
    "Subject:  " + ticket.subject, "Category: " + ticket.category,
    "Player:   " + (ticket.requester_name || "Unknown"), "Status:   " + ticket.status.replace("_", " "),
    ...(ticket.priority && ticket.priority !== "normal" ? ["Priority: " + ticket.priority] : []),
    ...(ticket.assigned_name ? ["Assigned: " + ticket.assigned_name] : []),
    ...(ticket.tags?.length ? ["Tags:     " + ticket.tags.join(", ")] : []),
    "Opened:   " + iso(ticket.created_at), "Exported: " + iso(Date.now()), "", "=".repeat(64), ""];
  const body = messages.flatMap(m => [
    `[${iso(m.created_at)}] ${labelFor(m)}`, m.body || "(no text)",
    ...(m.attachment_path ? ["[Image attached: " + m.attachment_path.split("/").pop().replace(/^[0-9a-f-]{36}-/, "") + "]"] : []), ""]);
  const blob = new Blob([[...head, ...body].join("\n")], { type: "text/plain;charset=utf-8" });
  const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: "mirage-ticket-" + (ticket.ticket_number || ticket.id.slice(0, 8)) + ".txt" });
  document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
