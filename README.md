# MirageSMP Support

Static HTML/CSS/JavaScript support portal for `support.miragesmp.org`, using Supabase Auth, Postgres Row Level Security, and private Storage.

## Files
- `index.html` — email/password and Discord sign-in, sign-up, password reset
- `dashboard.html` — player ticket creation, ticket history, replies and attachments
- `staff.html` — staff ticket queue, replies and status updates
- `supabase-setup.sql` — database tables, RLS policies, private attachment bucket and Storage policies
- `config.js` — public project configuration (fill in placeholders)

## Setup
1. In Supabase, open **SQL Editor**, paste and run `supabase-setup.sql`.
2. Create a Supabase project URL and publishable key (or legacy anon key). Put them in `config.js`. These public client values are intended for browser use; **never put a service-role/secret key in this repository**.
3. In Supabase **Authentication → URL Configuration**, set Site URL to `https://support.miragesmp.org` and add `https://support.miragesmp.org/**` to Redirect URLs. Also add your GitHub Pages URL while testing.
4. In **Authentication → Sign In / Providers**, enable Email. For Discord, create an application at the Discord Developer Portal, add the Supabase callback URL shown in the Supabase Discord provider settings as a Discord OAuth redirect, then enter the Discord client ID and secret in Supabase. Never put the Discord client secret in this repository.
5. Publish the repository using GitHub Pages (Settings → Pages → Deploy from a branch → `main` → `/(root)`). In IONOS, point `support.miragesmp.org` to the GitHub Pages custom-domain instructions and enable HTTPS in GitHub Pages. Add a `CNAME` file containing `support.miragesmp.org` if GitHub Pages requests it.
6. Create a player account on the site. In Supabase **Authentication → Users**, copy that account's user UUID. In SQL Editor, grant staff access manually:
   `insert into public.support_staff (user_id) values ('PASTE-USER-UUID-HERE');`
   Only trusted staff should be added. The website intentionally has no self-service staff promotion.
7. Test with two accounts: a normal player must only see their own tickets; a staff account can see the queue and update status.

## Important
- The SQL script is designed to be run by a project owner in Supabase SQL Editor. Review it before running on a project that already contains similarly named tables.
- RLS policies are the security boundary; page redirects are only a convenience.
- Attachments are stored in a private bucket and downloaded using short-lived signed URLs.
- Configure custom SMTP before public launch if you need reliable confirmation and password-reset email delivery.
- This repository does not contain your Supabase project credentials.