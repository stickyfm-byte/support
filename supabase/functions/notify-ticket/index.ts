// Emails the player when staff reply. Triggered by a Supabase Database Webhook on INSERT into public.ticket_messages.
// Secrets (never commit): RESEND_API_KEY.  SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are provided automatically.
import { createClient } from "npm:@supabase/supabase-js@2";
Deno.serve(async (req) => {
  const { record } = await req.json();
  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { data: staff } = await db.from("support_staff").select("user_id").eq("user_id", record.sender_id).maybeSingle();
  if (!staff) return new Response("not a staff reply"); // only notify players
  const { data: ticket } = await db.from("tickets").select("subject,created_by").eq("id", record.ticket_id).single();
  const { data: owner } = await db.auth.admin.getUserById(ticket!.created_by);
  const to = owner.user?.email; if (!to) return new Response("no email");
  const esc = (s: string) => s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]!));
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Mirage Support <support@miragesmp.org>", to, subject: `New reply: ${ticket!.subject}`,
      html: `<p>The Mirage team replied to <strong>${esc(ticket!.subject)}</strong>.</p><p><a href="https://support.miragesmp.org/dashboard/">Open your request</a></p>`,
    }),
  });
  return new Response(await r.text(), { status: r.status });
});
