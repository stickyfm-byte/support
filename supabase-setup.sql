-- MirageSMP Support schema. Run in Supabase SQL Editor as project owner.
-- Review before running if you already have tables with these names.

create extension if not exists pgcrypto;

create table if not exists public.support_staff (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.tickets (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references auth.users(id) on delete cascade,
  subject text not null check (char_length(subject) between 3 and 120),
  category text not null default 'General Support'
    check (category in ('General Support','Account','In-game issue','Bug report','Player report','Appeal','Other')),
  status text not null default 'open' check (status in ('open','in_progress','closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ticket_messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.tickets(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  body text not null default '' check (char_length(body) <= 5000),
  attachment_path text,
  created_at timestamptz not null default now(),
  constraint message_has_content check (char_length(trim(body)) > 0 or attachment_path is not null)
);

create index if not exists tickets_created_by_idx on public.tickets(created_by);
create index if not exists tickets_updated_at_idx on public.tickets(updated_at desc);
create index if not exists ticket_messages_ticket_created_idx on public.ticket_messages(ticket_id, created_at);

create or replace function public.is_support_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.support_staff where user_id = (select auth.uid()));
$$;

revoke all on function public.is_support_staff() from public;
grant execute on function public.is_support_staff() to authenticated;

create or replace function public.touch_ticket_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  update public.tickets set updated_at = now() where id = new.ticket_id;
  return new;
end;
$$;

drop trigger if exists ticket_message_touch_ticket on public.ticket_messages;
create trigger ticket_message_touch_ticket
after insert on public.ticket_messages
for each row execute function public.touch_ticket_updated_at();

alter table public.support_staff enable row level security;
alter table public.tickets enable row level security;
alter table public.ticket_messages enable row level security;

-- No client-side insert/update/delete policies for support_staff: staff grants are manual/admin-only.
drop policy if exists "Users can read own staff membership" on public.support_staff;
create policy "Users can read own staff membership"
on public.support_staff for select to authenticated
using (user_id = (select auth.uid()) or (select public.is_support_staff()));

drop policy if exists "Players and staff can read tickets" on public.tickets;
create policy "Players and staff can read tickets"
on public.tickets for select to authenticated
using (created_by = (select auth.uid()) or (select public.is_support_staff()));

drop policy if exists "Players can create own tickets" on public.tickets;
create policy "Players can create own tickets"
on public.tickets for insert to authenticated
with check (created_by = (select auth.uid()));

drop policy if exists "Staff can update ticket status" on public.tickets;
create policy "Staff can update ticket status"
on public.tickets for update to authenticated
using ((select public.is_support_staff()))
with check ((select public.is_support_staff()));

drop policy if exists "Players and staff can read ticket messages" on public.ticket_messages;
create policy "Players and staff can read ticket messages"
on public.ticket_messages for select to authenticated
using (
  (select public.is_support_staff()) or exists (
    select 1 from public.tickets t
    where t.id = ticket_id and t.created_by = (select auth.uid())
  )
);

drop policy if exists "Ticket owner or staff can send messages" on public.ticket_messages;
create policy "Ticket owner or staff can send messages"
on public.ticket_messages for insert to authenticated
with check (
  sender_id = (select auth.uid())
  and (
    (select public.is_support_staff())
    or exists (
      select 1 from public.tickets t
      where t.id = ticket_id
        and t.created_by = (select auth.uid())
        and t.status <> 'closed'
    )
  )
);

-- A private bucket; objects use <ticket-uuid>/<uploader-uuid>/<filename>.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('ticket-attachments', 'ticket-attachments', false, 5242880,
        array['image/png','image/jpeg','image/webp','image/gif'])
on conflict (id) do update set public = false, file_size_limit = 5242880,
  allowed_mime_types = array['image/png','image/jpeg','image/webp','image/gif'];

drop policy if exists "Ticket participants can read attachments" on storage.objects;
create policy "Ticket participants can read attachments"
on storage.objects for select to authenticated
using (
  bucket_id = 'ticket-attachments'
  and (
    (select public.is_support_staff())
    or exists (
      select 1 from public.tickets t
      where t.id::text = (storage.foldername(name))[1]
        and t.created_by = (select auth.uid())
    )
  )
);

drop policy if exists "Ticket participants can upload attachments" on storage.objects;
create policy "Ticket participants can upload attachments"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'ticket-attachments'
  and (storage.foldername(name))[2] = (select auth.uid())::text
  and (
    (select public.is_support_staff())
    or exists (
      select 1 from public.tickets t
      where t.id::text = (storage.foldername(name))[1]
        and t.created_by = (select auth.uid())
        and t.status <> 'closed'
    )
  )
);

drop policy if exists "Uploaders or staff can delete attachments" on storage.objects;
create policy "Uploaders or staff can delete attachments"
on storage.objects for delete to authenticated
using (
  bucket_id = 'ticket-attachments'
  and (
    (select public.is_support_staff())
    or (storage.foldername(name))[2] = (select auth.uid())::text
  )
);

grant select on public.support_staff, public.tickets, public.ticket_messages to authenticated;
grant insert on public.tickets, public.ticket_messages to authenticated;
grant update on public.tickets to authenticated;
