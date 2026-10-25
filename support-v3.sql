-- Run once in the Supabase SQL Editor (after support-v2.sql). Safe to re-run.
-- Turns on live updates: new messages and ticket changes are pushed to open pages (row-level security still applies).
do $$ begin alter publication supabase_realtime add table public.ticket_messages; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.tickets; exception when duplicate_object then null; end $$;
