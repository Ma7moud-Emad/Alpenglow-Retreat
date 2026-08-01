import supabase, { describeError } from "../lib/supabase";

const COLUMNS = "id, email, full_name, avatar_url, role, created_at";

export async function getMyProfile() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("staff")
    .select(COLUMNS)
    .eq("id", user.id)
    .maybeSingle();

  if (error) throw new Error(describeError(error, "Could not load your profile"));
  return data;
}

export async function getStaff() {
  const { data, error } = await supabase
    .from("staff")
    .select(COLUMNS)
    .order("role", { ascending: true })
    .order("full_name", { ascending: true });

  if (error) throw new Error(describeError(error, "Could not load the team"));
  return data ?? [];
}

export async function updateMyProfile({ fullName, avatarUrl }) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You are not signed in");

  const patch = {};
  if (fullName !== undefined) patch.full_name = fullName;
  if (avatarUrl !== undefined) patch.avatar_url = avatarUrl;

  const { data, error } = await supabase
    .from("staff")
    .update(patch)
    .eq("id", user.id)
    .select(COLUMNS)
    .single();

  if (error) throw new Error(describeError(error, "Could not save your profile"));
  return data;
}

/**
 * Creating, deleting and re-roling accounts needs the service_role key, which
 * must never reach the browser. These proxy to the `staff-admin` edge function,
 * which re-checks that the caller is an admin before doing anything.
 */
async function callStaffAdmin(body) {
  const { data, error } = await supabase.functions.invoke("staff-admin", {
    body,
  });

  if (error) {
    // Non-2xx responses carry the useful message in the response body.
    const detail = await error.context?.json?.().catch(() => null);
    throw new Error(detail?.error ?? describeError(error, "Request failed"));
  }
  if (data?.error) throw new Error(data.error);
  return data;
}

export function createStaffMember({ email, password, fullName, role }) {
  return callStaffAdmin({ action: "create", email, password, fullName, role });
}

export function deleteStaffMember(userId) {
  return callStaffAdmin({ action: "delete", userId });
}

export function setStaffRole({ userId, role }) {
  return callStaffAdmin({ action: "setRole", userId, role });
}
