-- Run in Supabase SQL Editor as project owner after both email addresses have accounts.
-- This grants staff dashboard access only; it does not change account passwords.
insert into public.support_staff (user_id)
select id from auth.users where lower(email) in (
  lower('soobiem12@gmail.com'),
  lower('businessiconology@gmail.com')
)
on conflict (user_id) do nothing;

-- Verify which requested accounts were found and granted staff access.
select u.email, s.user_id, s.created_at
from public.support_staff s
join auth.users u on u.id = s.user_id
where lower(u.email) in (
  lower('soobiem12@gmail.com'),
  lower('businessiconology@gmail.com')
)
order by lower(u.email);

-- If either account is missing from the results, that email must sign up first,
-- then rerun this script. Never put a service-role key in website code.
