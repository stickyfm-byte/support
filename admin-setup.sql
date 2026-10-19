-- Run in Supabase SQL Editor as project owner after this email has signed up.
insert into public.support_staff (user_id)
select id from auth.users where lower(email) = lower('soobiem12@gmail.com')
on conflict (user_id) do nothing;

-- Verify that the account has staff access:
select u.email, s.user_id, s.created_at
from public.support_staff s join auth.users u on u.id = s.user_id
where lower(u.email) = lower('soobiem12@gmail.com');

-- If no row is inserted, create/confirm the account first and rerun this script.
-- Never put a service-role key in website code.