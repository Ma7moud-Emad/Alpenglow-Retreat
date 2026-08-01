import supabase, { describeError } from "../lib/supabase";

/** Settings is a singleton row, guarded by a unique index in the database. */
export async function getSettings() {
  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .limit(1)
    .single();

  if (error) throw new Error(describeError(error, "Could not load settings"));
  return data;
}

export async function updateSettings(patch) {
  const { data, error } = await supabase
    .from("settings")
    .update(patch)
    .eq("id", 1)
    .select()
    .single();

  if (error) throw new Error(describeError(error, "Could not save settings"));
  return data;
}
