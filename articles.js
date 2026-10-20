// Help-centre content. Edit freely: add an object to ARTICLES and it appears everywhere (home, search, sidebar).
export const CATS = [
  { id: "start", title: "Getting started", desc: "Make an account and send your first request" },
  { id: "account", title: "Account & sign-in", desc: "Verification emails, passwords and Discord login" },
  { id: "playing", title: "Playing & bugs", desc: "Connection problems, lag and reporting bugs" },
  { id: "reports", title: "Reports, appeals & safety", desc: "Report a player, appeal, and spot scams" }
];
const A = (id, cat, title, keys, body, popular = false) => ({ id, cat, title, keys, body, popular });
export const ARTICLES = [
  A("create-account", "start", "How do I create a support account?", "sign up register username",
   `<p>Open the <a href="/login.html">sign-in page</a> and choose <strong>Create account</strong>. Pick a username, add an email address you can access, and set a strong password. You can also continue with Discord.</p><p>You may need to verify your email before you can sign in, so keep that inbox handy.</p>`, true),
  A("open-a-request", "start", "How do I open a useful request?", "ticket category subject new",
   `<p>Choose the closest category, write a specific subject, then explain what happened.</p><h2>Include</h2><ul><li>When it happened</li><li>What you were trying to do</li><li>What you expected, and what actually happened</li><li>A screenshot if it helps (PNG, JPG, WEBP or GIF, up to 5 MB)</li></ul><p>Submit once and keep adding to the same request. Duplicates make the history harder to follow and don't speed things up.</p>`, true),
  A("request-statuses", "start", "What do request statuses mean?", "open closed in progress status response time",
   `<p><strong>Open</strong> means it's waiting for attention. <strong>In progress</strong> means a team member is working on it. <strong>Closed</strong> means the conversation is finished. If the issue comes back, open a new request and mention the earlier one.</p><p>We can't promise an exact reply time, as it depends on staff availability and how much detail you gave. Please don't ping individual staff; add updates to your original request instead.</p>`),
  A("no-verification-email", "account", "I didn't get my verification email", "email spam junk confirm link expired invalid",
   `<p>Check spam, junk and promotions first, and make sure you typed the right address.</p><p>If a link says it has <strong>expired</strong> or was already used, request a fresh email and use only the newest one, in the same browser you plan to sign in with.</p><p>Still nothing? Ask in our <a href="https://discord.gg/mirageevents">Discord</a>.</p>`, true),
  A("reset-password", "account", "I forgot my password", "password reset recover login",
   `<p>On the sign-in page choose <strong>Forgot password?</strong>, enter your email and follow the link we send. Staff can't see or reset your password for you, and will never ask for it.</p>`, true),
  A("change-email", "account", "Can I change my account email?", "email change username",
   `<p>Open a request from the email currently on your account, choose <strong>Account</strong>, and tell us what to change. We may ask a few questions to confirm it's you. Never send passwords or login codes.</p>`),
  A("cant-connect", "playing", "I can't connect or I'm lagging", "lag connect server ip java disconnect timeout",
   `<p>Our server address is <strong>mc.miragesmp.org</strong> (Java Edition).</p><ul><li>Check the <a href="https://miragesmp.org/status/">status page</a> for outages</li><li>Make sure you're on the version announced in our Discord</li><li>Try without a VPN, and restart your router if you're dropping often</li></ul><p>Still stuck? Open a request with the exact error text, when it started, and whether other servers work.</p>`, true),
  A("report-bug", "playing", "What should a bug report include?", "bug glitch report steps",
   `<p>Pick <strong>Bug report</strong> and give us the steps to repeat it, what you expected, what happened, the rough time, and any error text. Tell us if it happens every time or only sometimes.</p>`),
  A("report-player", "reports", "How do I report a player?", "report player rule evidence harassment",
   `<p>Choose <strong>Player report</strong> with the player's name, the rough date and time, what happened and any evidence. Keep it factual. Don't edit evidence or share private info, and please don't use reports to harass anyone.</p>`),
  A("appeal", "reports", "How do I appeal a punishment?", "appeal ban mute punishment review",
   `<p>Choose <strong>Appeal</strong> and include your in-game name, the approximate date, the reason you were shown and a clear, honest explanation. An appeal is a request for review, not a guarantee. Duplicate appeals slow things down.</p>`),
  A("staff-never-ask", "reports", "Staff will never ask for your password", "scam phishing safe password code genuine",
   `<p>We will never ask for your password, login codes or recovery links. Start from this portal or our official Discord, and be careful with anyone who sends unfamiliar links or asks you to install software. If something feels off, close it and tell us.</p>`, true)
];
