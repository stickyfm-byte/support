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
function setAuthMode(mode) {
  tabs.forEach(tab => {
    const active = tab.dataset.tab === mode;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", String(active));
    tab.setAttribute("tabindex", active ? "0" : "-1");
  });
  document.querySelector("#login-form").hidden = mode !== "login";
  document.querySelector("#signup-form").hidden = mode !== "signup";
  showMessage(notice, "");
}
tabs.forEach(tab => tab.addEventListener("click", () => setAuthMode(tab.dataset.tab)));
setAuthMode("login");

document.querySelector("#login-form").addEventListener("submit", async event => {
  event.preventDefault();
  if (!supabase) return showMessage(notice, "Complete Supabase setup first.", true);
  const form = new FormData(event.currentTarget);
  const { error } = await supabase.auth.signInWithPassword({
    email: form.get("email"), password: form.get("password")
  });
  if (error) return showMessage(notice, error.message, true);
  const { data: userData } = await supabase.auth.getUser();
  const { data: staffData } = await supabase.from("support_staff").select("user_id").eq("user_id", userData.user.id).maybeSingle();
  location.href = staffData ? "/staff.html" : "/dashboard/";
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
      emailRedirectTo: SITE_URL + "/dashboard/",
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
  if (data.session) location.href = "/dashboard/";
  else showMessage(notice, "Account created. Check your email for the verification link.");
});

document.querySelector("#discord-login").addEventListener("click", async () => {
  if (!supabase) return showMessage(notice, "Complete Supabase setup first.", true);
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "discord",
    options: { redirectTo: SITE_URL + "/dashboard/" }
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
  if (data.session) {
    const { data: staffData } = await supabase.from("support_staff").select("user_id").eq("user_id", data.session.user.id).maybeSingle();
    location.replace(staffData ? "/staff.html" : "/dashboard/");
  }
}