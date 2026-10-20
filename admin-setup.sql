-- Mirage Support administrator setup.
-- Run in Supabase SQL Editor AFTER supabase-setup.sql and support-upgrade.sql.
-- businessiconology@gmail.com must have created and verified an account first.

create or replace function public.is_support_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from auth.users u
    where u.id = (select auth.uid())
      and lower(u.email) = 'businessiconology@gmail.com'
  );
$$;
revoke all on function public.is_support_admin() from public;
grant execute on function public.is_support_admin() to authenticated;

-- Ensure the administrator can open the staff queue. The admin identity is still
-- checked independently by is_support_admin(), not by this membership row alone.
insert into public.support_staff (user_id)
select id from auth.users where lower(email) = 'businessiconology@gmail.com'
on conflict (user_id) do nothing;

-- Keep the existing named staff account if it exists.
insert into public.support_staff (user_id)
select id from auth.users where lower(email) = 'soobiem12@gmail.com'
on conflict (user_id) do nothing;

create or replace function public.admin_grant_support_staff(target_email text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare target_id uuid;
begin
  if not public.is_support_admin() then
    raise exception 'Administrator access required';
  end if;
  select id into target_id from auth.users where lower(email) = lower(trim(target_email));
  if target_id is null then
    raise exception 'No account found for that email. Ask the person to create an account first.';
  end if;
  insert into public.support_staff(user_id) values (target_id) on conflict (user_id) do nothing;
  return true;
end;
$$;

create or replace function public.admin_revoke_support_staff(target_email text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare target_id uuid;
begin
  if not public.is_support_admin() then
    raise exception 'Administrator access required';
  end if;
  if lower(trim(target_email)) = 'businessiconology@gmail.com' then
    raise exception 'The primary administrator cannot be removed.';
  end if;
  select id into target_id from auth.users where lower(email) = lower(trim(target_email));
  if target_id is null then
    raise exception 'No account found for that email.';
  end if;
  delete from public.support_staff where user_id = target_id;
  return true;
end;
$$;

create or replace function public.admin_delete_support_ticket(target_ticket_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_support_admin() then
    raise exception 'Administrator access required';
  end if;
  delete from public.tickets where id = target_ticket_id;
  return found;
end;
$$;

revoke all on function public.admin_grant_support_staff(text) from public;
revoke all on function public.admin_revoke_support_staff(text) from public;
revoke all on function public.admin_delete_support_ticket(uuid) from public;
grant execute on function public.admin_grant_support_staff(text) to authenticated;
grant execute on function public.admin_revoke_support_staff(text) to authenticated;
grant execute on function public.admin_delete_support_ticket(uuid) to authenticated;

-- Verification: the administrator should appear in this result.
select u.email, s.user_id, s.created_at
from public.support_staff s
join auth.users u on u.id = s.user_id
where lower(u.email) in (lower('businessiconology@gmail.com'), lower('soobiem12@gmail.com'))
order by lower(u.email);
