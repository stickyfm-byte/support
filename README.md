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
6. Create the account for `businessiconology@gmail.com` first. Run `admin-setup.sql` in Supabase SQL Editor after the setup and upgrade scripts. This grants the primary admin role based on the authenticated account email and enables the admin-only staff-management/ticket-deletion RPCs. If the account does not exist yet, create it first and rerun the SQL.
7. Admin controls appear on `/staff.html` for `businessiconology@gmail.com`: grant/revoke staff access by email, view all tickets, change ticket status, reply, reopen/close, and delete tickets. These actions are enforced by Supabase functions/RLS, not just hidden UI.
8. To grant additional non-admin staff manually, use SQL Editor and the target user's UUID in `public.support_staff`. Never grant staff to an untrusted account.
9. Test with at least two accounts: a normal player must only see their own tickets; a staff account can see the queue and update status.

## Important
- The SQL script is designed to be run by a project owner in Supabase SQL Editor. Review it before running on a project that already contains similarly named tables.
- RLS policies are the security boundary; page redirects are only a convenience.
- Attachments are stored in a private bucket and downloaded using short-lived signed URLs.
- Configure custom SMTP before public launch if you need reliable confirmation and password-reset email delivery. For Resend SMTP, use host `smtp.resend.com`, port `465` (SSL) or `587` (STARTTLS), username `resend`, and the Resend API key as the SMTP password. The sender address must belong to a domain verified in Resend. Never commit the API key to this repository.
- This repository does not contain your Supabase project credentials.

## Redesign setup (v2)
0. **Run `support-v2.sql` in the Supabase SQL Editor (after the other SQL files) before using the new ticket features.** It adds assignment, priority, tags, ratings, the staff flag on messages, and the spam limits (3 open tickets per player, 2 minutes between tickets; edit the numbers inside the file).
1. Run `support-upgrade.sql` in the Supabase SQL Editor (adds ticket numbers and requester names for staff).
2. **Auth emails via Resend:** Supabase → Project Settings → Authentication → SMTP Settings. Host `smtp.resend.com`, port `465`, user `resend`, password = your Resend API key, sender e.g. `support@miragesmp.org` (domain must be verified in Resend).
3. **"Staff replied" emails (optional):** `supabase functions deploy notify-ticket --no-verify-jwt`, then `supabase secrets set RESEND_API_KEY=...`. In Supabase → Database → Webhooks, create a webhook on `ticket_messages` INSERT pointing at the function URL.
4. Edit help articles in `articles.js`. Check the server details in them (address, Java version, Discord link) are correct.

## v3 features
Run `support-v3.sql` in the Supabase SQL Editor (after `support-v2.sql`) to turn on live updates. Also added: light/dark theme toggle, player history on staff tickets, admin JSON/CSV backup, browser notifications (work while the page is open in a tab).

## v4 features: settings page, languages, staff display
1. Run `support-v4.sql` in the Supabase SQL Editor (after `support-v3.sql`). It adds per-account settings and the display name/badge staff can show on replies.
2. Players and staff open **Settings** (`/settings.html`): language, light/dark/auto, accent colour, text size, density, time format, notifications, reply sound and volume, animation level, display name. Staff also get a Staff section: display name, badge label and colour, show name on replies, auto-claim on reply, default queue.
3. Settings are saved on the device instantly and synced to the account when signed in.
4. **Languages** live in `i18n.js` (English, Español, Français, Deutsch, Português). To add one, add it to `LANGS` and add one more string to every row. Article text, the legal pages and the staff pages stay in English.
5. If you use the reply-email function, redeploy it: it now respects each player's "Email me when staff reply" setting.

## v5: quick display name for staff
Staff and admins get a small **✎ name** button in the staff page header: click it, type a display name, save. It is shown when you claim a ticket and on your replies, syncs to your account, and can also be changed (with badge label and colour) in Settings → Staff. If left empty, your account username is used.

### If ticket deletion fails
Run `ticket-delete-fix.sql` in the Supabase SQL Editor, then reload `/staff/`. Permanent deletion is restricted to the primary administrator account `businessiconology@gmail.com`. If you see “Administrator access required”, the browser session is signed into a different account; sign out and sign in with the primary administrator account. The page now displays the database error rather than silently failing.
