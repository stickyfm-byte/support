import { supabase, configured, showMessage } from "./supabase.js";
import { SITE_URL } from "./config.js";

const notice = document.querySelector("#notice");
const warning = document.querySelector("#setup-warning");
if (!configured) warning.hidden = false;
if (new URLSearchParams(location.search).has("setup")) {
  showMessage(notice, "Add your Supabase project URL and public key to config.js, then reload.", true);
}
if (location.hash.includes("error_description")) {
  const params = new URLSearchParams(location.hash.slice(1));
  const code = params.get("error_code");
  const description = params.get("error_description") || "Sign-in could not be completed.";
  showMessage(notice, code === "otp_expired" ? "That confirmation link has expired or was already used. Request a fresh confirmation email and open the newest link. If it keeps happening, check the Supabase Site URL and confirmation email template." : description, true);
  history.replaceState(null, "", location.pathname);
}

const tabs = [...document.querySelectorAll("[data-tab]")];
tabs.forEach(tab => tab.addEventListener("click", () => {
  tabs.forEach(item => item.classList.toggle("active", item === tab));
  document.querySelector("#login-form").hidden = tab.dataset.tab !== "login";
  document.querySelector("#signup-form").hidden = tab.dataset.tab !== "signup";
  showMessage(notice, "");
}));

document.querySelector("#login-form").addEventListener("submit", async event => {
  event.preventDefault();
  if (!supabase) return showMessage(notice, "Complete Supabase setup first.", true);
  const form = new FormData(event.currentTarget);
  const { error } = await supabase.auth.signInWithPassword({
    email: form.get("email"), password: form.get("password")
  });
  if (error) return showMessage(notice, error.message, true);
  location.href = "dashboard.html";
});

document.querySelector("#signup-form").addEventListener("submit", async event => {
  event.preventDefault();
  if (!supabase) return showMessage(notice, "Complete Supabase setup first.", true);
  const form = new FormData(event.currentTarget);
  const username = String(form.get("username") || "").trim();
  if (!/^[A-Za-z0-9_]{3,24}$/.test(username)) {
    return showMessage(notice, "Username must be 3–24 characters using only letters, numbers or underscores.", true);
  }
  const { data, error } = await supabase.auth.signUp({
    email: form.get("email"),
    password: form.get("password"),
    options: {
      emailRedirectTo: SITE_URL + "/dashboard.html",
      data: { username }
    }
  });
  if (error) {
    if (/rate limit|email rate limit exceeded|too many requests/i.test(error.message || "")) {
      return showMessage(notice, "Supabase has temporarily limited email sending. Wait a while before trying again, and avoid repeatedly requesting verification or password-reset emails. For a lasting fix, configure custom SMTP in Supabase Dashboard → Project Settings → Authentication/SMTP Settings (or Authentication → SMTP Settings, depending on dashboard layout), then review Authentication rate limits.", true);
    }
    if (/database error saving new user/i.test(error.message || "")) {
      return showMessage(notice, "Supabase rejected the account while saving it to the database. A database trigger or username constraint likely needs fixing; check the Supabase Postgres logs for the exact cause.", true);
    }
    return showMessage(notice, error.message, true);
  }
  if (data.session) location.href = "dashboard.html";
  else showMessage(notice, "Account created. Check your email for the verification link.");
});

document.querySelector("#discord-login").addEventListener("click", async () => {
  if (!supabase) return showMessage(notice, "Complete Supabase setup first.", true);
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "discord",
    options: { redirectTo: SITE_URL + "/dashboard.html" }
  });
  if (error) showMessage(notice, error.message, true);
});

document.querySelector("#reset-password").addEventListener("click", async () => {
  if (!supabase) return showMessage(notice, "Complete Supabase setup first.", true);
  const email = document.querySelector('#login-form input[name="email"]').value.trim();
  if (!email) return showMessage(notice, "Enter your email address first.", true);
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: SITE_URL + "/reset-password.html"
  });
  if (error) return showMessage(notice, error.message, true);
  showMessage(notice, "If that email is registered, a password-reset link will be sent.");
});

if (supabase) {
  const { data } = await supabase.auth.getSession();
  if (data.session) location.replace("dashboard.html");
}