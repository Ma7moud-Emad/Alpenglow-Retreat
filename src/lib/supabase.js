import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase configuration. Copy .env.example to .env.local and fill " +
      "in " +
      "VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."
  );
}

/**
 * The browser client is deliberately limited to the anon key. Every table is
 * protected by row level security, so this key grants nothing on its own;
 * access is decided by the signed-in user's staff profile and role.
 *
 * Operations that genuinely need elevated rights (creating and deleting staff
 * accounts) go through the `staff-admin` edge function, which holds the
 * service_role key server-side.
 */
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export const STORAGE_BUCKETS = {
  cabins: "cabins-images",
  avatars: "avatars",
};

/**
 * Supabase surfaces RLS rejections as opaque messages ("new row violates row
 * level security policy"). Translate the ones staff can actually hit.
 */
export function describeError(error, fallback = "Something went wrong") {
  if (!error) return fallback;
  const message = error.message ?? String(error);

  if (/row[- ]level security/i.test(message)) {
    return "You do not have permission to do that.";
  }
  if (error.code === "23503") {
    return "This record is still referenced by a booking and cannot be removed.";
  }
  if (error.code === "23505" || /duplicate key/i.test(message)) {
    return "A record with those details already exists.";
  }
  if (error.code === "23514" || /violates check constraint/i.test(message)) {
    return "Those values are outside the range the hotel allows.";
  }
  if (/Invalid login credentials/i.test(message)) {
    return "That email and password combination is not recognised.";
  }
  if (/Failed to fetch|NetworkError/i.test(message)) {
    return "Cannot reach the server. Check your connection and try again.";
  }
  return message || fallback;
}

export default supabase;
