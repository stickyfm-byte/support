-- Run once in the Supabase SQL Editor AFTER supabase-setup.sql, support-upgrade.sql and admin-setup.sql. Safe to re-run.
-- Adds: assignment/priority/tags, close + rating, a reliable "staff" flag on messages, and server-side spam protection.

alter table public.tickets
  add column if not exists assigned_to uuid references auth.users(id) on delete set null,
  add column if not exists assigned_name text check (char_length(assigned_name) <= 80),
  add column if not exists priority text not null default 'normal' check (priority in ('low','normal','high','urgent')),
  add column if not exists tags text[] not null default '{}' check (cardinality(tags) <= 8),
  add column if not exists rating smallint check (rating in (-1, 1)),
  add column if not exists rating_comment text check (char_length(rating_comment) <= 500),
  add column if not exists rated_at timestamptz;

-- Players can't read the support_staff table, so the staff flag is stamped on each message when it is sent.
alter table public.ticket_messages add column if not exists is_staff boolean not null default false;
update public.ticket_messages m set is_staff = true
  where not is_staff and exists (select 1 from public.support_staff s where s.user_id = m.sender_id);

create or replace function public.set_message_is_staff() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  new.is_staff := exists (select 1 from public.support_staff where user_id = new.sender_id);
  return new;
end $$;
drop trigger if exists ticket_message_is_staff on public.ticket_messages;
create trigger ticket_message_is_staff before insert on public.ticket_messages
  for each row execute function public.set_message_is_staff();

-- Spam protection (enforced in the database, so it cannot be bypassed from the browser).
-- Change the 3 and the 2 minutes below to taste.
create or replace function public.guard_ticket_insert() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if public.is_support_staff() then return new; end if;
  if (select count(*) from public.tickets where created_by = new.created_by and status <> 'closed') >= 3 then
    raise exception 'You already have 3 open requests. Please wait for a reply or close one before opening another.';
  end if;
  if exists (select 1 from public.tickets where created_by = new.created_by and created_at > now() - interval '2 minutes') then
    raise exception 'Please wait a couple of minutes before sending another request.';
  end if;
  return new;
end $$;
drop trigger if exists ticket_guard_insert on public.tickets;
create trigger ticket_guard_insert before insert on public.tickets
  for each row execute function public.guard_ticket_insert();

-- Players may only close their own ticket and rate it once; everything else stays staff-only.
create or replace function public.guard_ticket_update() returns trigger
language plpgsql security definer set search_path = public as $$
declare skip text[] := array['status','updated_at','rating','rating_comment','rated_at'];
begin
  if public.is_support_staff() then return new; end if;
  if (to_jsonb(new) - skip) is distinct from (to_jsonb(old) - skip) then
    raise exception 'You can only close or rate your own request.';
  end if;
  if new.status is distinct from old.status and new.status <> 'closed' then
    raise exception 'Only the support team can reopen a request.';
  end if;
  if (new.rating, new.rating_comment, new.rated_at) is distinct from (old.rating, old.rating_comment, old.rated_at) then
    if old.rating is not null then raise exception 'This request has already been rated.'; end if;
    if new.status <> 'closed' then raise exception 'You can rate a request once it is closed.'; end if;
  end if;
  return new;
end $$;
drop trigger if exists ticket_guard_update on public.tickets;
create trigger ticket_guard_update before update on public.tickets
  for each row execute function public.guard_ticket_update();

drop policy if exists "Owners can close and rate own tickets" on public.tickets;
create policy "Owners can close and rate own tickets"
on public.tickets for update to authenticated
using (created_by = (select auth.uid()))
with check (created_by = (select auth.uid()));
