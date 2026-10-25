-- Run once in the Supabase SQL Editor (after support-v3.sql). Safe to re-run.
-- Adds: per-account settings, and the display name/badge staff choose to show on their replies.

create table if not exists public.user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  settings jsonb not null default '{}'::jsonb check (pg_column_size(settings) < 8192),
  updated_at timestamptz not null default now()
);
alter table public.user_settings enable row level security;
drop policy if exists "Users read own settings" on public.user_settings;
drop policy if exists "Users insert own settings" on public.user_settings;
drop policy if exists "Users update own settings" on public.user_settings;
create policy "Users read own settings" on public.user_settings for select to authenticated using (user_id = (select auth.uid()));
create policy "Users insert own settings" on public.user_settings for insert to authenticated with check (user_id = (select auth.uid()));
create policy "Users update own settings" on public.user_settings for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
grant select, insert, update on public.user_settings to authenticated;

-- Staff display on replies. Only kept when the sender really is staff, so players cannot fake a staff name.
alter table public.ticket_messages
  add column if not exists sender_name text check (char_length(sender_name) <= 40),
  add column if not exists sender_badge text check (char_length(sender_badge) <= 16),
  add column if not exists sender_color text check (sender_color in ('cyan','violet','mint','rose','gold'));

create or replace function public.set_message_is_staff() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  new.is_staff := exists (select 1 from public.support_staff where user_id = new.sender_id);
  if not new.is_staff then new.sender_name := null; new.sender_badge := null; new.sender_color := null; end if;
  return new;
end $$;
