import supabase, { describeError, STORAGE_BUCKETS } from "../lib/supabase";

export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw new Error(describeError(error, "Could not sign in"));
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(describeError(error, "Could not sign out"));
}

/**
 * Sends a reset link. Used by the "forgot password" flow, which is the only
 * place a reset email belongs. The old change-password screen fired one on
 * every submit *and* then changed the password directly.
 */
export async function requestPasswordReset(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  if (error) throw new Error(describeError(error, "Could not send reset email"));
}

/**
 * Changes the signed-in user's password. Supabase does not verify the current
 * password on updateUser, so it is checked here by re-authenticating first;
 * otherwise an unattended session is enough to take over the account.
 */
export async function changePassword({ currentPassword, newPassword }) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) throw new Error("You are not signed in");

  const { error: reauthError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });
  if (reauthError) throw new Error("Your current password is not correct");

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw new Error(describeError(error, "Could not update password"));
}

export async function updateEmail(email) {
  const { error } = await supabase.auth.updateUser({ email });
  if (error) throw new Error(describeError(error, "Could not update email"));
}

/** Avatars are namespaced `<userId>/<timestamp>.<ext>` to match storage RLS. */
export async function uploadAvatar(file, userId) {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${userId}/${Date.now()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKETS.avatars)
    .upload(path, file, { cacheControl: "3600", upsert: false });

  if (uploadError) {
    throw new Error(describeError(uploadError, "Could not upload avatar"));
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(STORAGE_BUCKETS.avatars).getPublicUrl(path);

  return publicUrl;
}
