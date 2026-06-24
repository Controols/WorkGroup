// Shared Supabase client + auth/role helpers for the Linen Works portal.
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config.js";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Return the signed-in user's profile row, or null if not signed in.
export async function getProfile() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();
  if (error) return null;
  return { ...data, email: session.user.email };
}

// Guard a page: ensure the user is signed in AND has the required role.
// Redirects to login (or the other dashboard) and returns null if not allowed.
export async function requireRole(role) {
  const profile = await getProfile();
  if (!profile) { location.href = "index.html"; return null; }
  if (profile.role !== role) {
    location.href = profile.role === "employee" ? "employee.html" : "customer.html";
    return null;
  }
  return profile;
}

export async function signOut() {
  await supabase.auth.signOut();
  location.href = "index.html";
}

// --- small view helpers -----------------------------------------------------

export function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, c => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
}

export function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
  });
}

export function statusLabel(s) {
  return { pending: "Pending", processing: "Processing", fulfilled: "Fulfilled", cancelled: "Cancelled" }[s] || s;
}
