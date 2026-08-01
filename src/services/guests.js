import supabase, { describeError } from "../lib/supabase";

export async function getGuest(id) {
  const { data, error } = await supabase
    .from("guests")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(describeError(error, "Could not load the guest"));
  return data;
}

export async function getGuests({ search = "" } = {}) {
  let query = supabase.from("guests").select("*");

  const term = search.trim();
  if (term) {
    query = query.or(`fullName.ilike.%${term}%,email.ilike.%${term}%`);
  }

  const { data, error } = await query.order("fullName", { ascending: true });
  if (error) throw new Error(describeError(error, "Could not load guests"));
  return data ?? [];
}

export async function updateGuest({ id, ...patch }) {
  const { data, error } = await supabase
    .from("guests")
    .update(patch)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(describeError(error, "Could not update the guest"));
  return data;
}
