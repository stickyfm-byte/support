import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SUPABASE_URL, SUPABASE_PUBLIC_KEY } from "./config.js";

export const configured =
  SUPABASE_URL.startsWith("https://") &&
  !SUPABASE_URL.includes("YOUR-PROJECT-REF") &&
  SUPABASE_PUBLIC_KEY.length > 20 &&
  !SUPABASE_PUBLIC_KEY.includes("YOUR_SUPABASE");

export const supabase = configured
  ? createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY)
  : null;

export function showMessage(element, message, isError = false) {
  if (!element) return;
  element.textContent = message;
  element.classList.toggle("error", isError);
  element.hidden = !message;
}

export async function requireUser() {
  if (!configured || !supabase) {
    location.replace("/login.html?setup=1");
    return null;
  }
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    location.replace("/login.html");
    return null;
  }
  return data.user;
}

export async function isStaff(userId) {
  if (!supabase) return false;
  const { data, error } = await supabase
    .from("support_staff")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();
  return !error && !!data;
}


export async function isAdmin() {
  if (!supabase) return false;
  const { data, error } = await supabase.rpc("is_support_admin");
  return !error && data === true;
}

export function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}

export function formatDate(value) {
  return new Date(value).toLocaleString();
}

export async function signOut() {
  if (supabase) await supabase.auth.signOut();
  location.replace("/");
}