import { supabase, configured, showMessage } from "./supabase.js";
const notice = document.querySelector("#notice");
const form = document.querySelector("#reset-form");
if (!configured) {
  form.hidden = true;
  showMessage(notice, "Complete Supabase setup first by adding the project URL and public key to config.js.", true);
}
form.addEventListener("submit", async event => {
  event.preventDefault();
  if (!supabase) return;
  const password = String(new FormData(form).get("password"));
  if (password.length < 8) return showMessage(notice, "Use at least 8 characters.", true);
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return showMessage(notice, error.message, true);
  showMessage(notice, "Password updated. You can now continue to your tickets.");
  form.reset();
  const button = form.querySelector("button");
  button.textContent = "Password updated";
  button.disabled = true;
});