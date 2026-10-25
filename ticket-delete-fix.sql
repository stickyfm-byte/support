-- Mirage Support: repair permanent ticket deletion.
-- Run this entire file in Supabase Dashboard -> SQL Editor, then reload /staff/.
-- The primary admin is businessiconology@gmail.com. The browser must be signed in
-- to that exact verified account for deletion to be allowed.

create or replace function public.is_support_admin()
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select exists (
    select 1
    from auth.users u
    where u.id = auth.uid()
      and lower(coalesce(u.email, '')) = 'businessiconology@gmail.com'
  );
$$;

revoke all on function public.is_support_admin() from public, anon;
grant execute on function public.is_support_admin() to authenticated;

create or replace function public.admin_delete_support_ticket(target_ticket_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if auth.uid() is null or not public.is_support_admin() then
    raise exception 'Administrator access required. Sign in using the primary administrator account.' using errcode = '42501';
  end if;

  delete from public.tickets where id = target_ticket_id;
  if not found then
    return false;
  end if;
  return true;
end;
$$;

revoke all on function public.admin_delete_support_ticket(uuid) from public, anon;
grant execute on function public.admin_delete_support_ticket(uuid) to authenticated;

-- ticket_messages.ticket_id should already use ON DELETE CASCADE from supabase-setup.sql.
-- Verify the function exists and is executable for signed-in users:
select p.proname, pg_get_function_identity_arguments(p.oid) as arguments
from pg_proc p join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public' and p.proname in ('is_support_admin', 'admin_delete_support_ticket');
