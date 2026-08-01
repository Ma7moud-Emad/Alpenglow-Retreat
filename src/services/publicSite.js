import supabase, { describeError } from "../lib/supabase";

/**
 * Queries the public marketing site makes. These run with the anon key and no
 * session, so they can only reach what the `cabins: public read published`
 * policy allows: published rooms and nothing else.
 */

const ROOM_COLUMNS = `
  id, slug, name, tagline, description, image, gallery,
  "maxCapacity", "regularPrice", discount, amenities,
  bed_type, size_sqm, rating, sort_order
`;

export async function getPublicRooms() {
  const { data, error } = await supabase
    .from("cabins")
    .select(ROOM_COLUMNS)
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error) throw new Error(describeError(error, "Could not load our rooms"));
  return data ?? [];
}

export async function getPublicRoom(slug) {
  const { data, error } = await supabase
    .from("cabins")
    .select(ROOM_COLUMNS)
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) throw new Error(describeError(error, "Could not load this room"));
  if (!data) throw new Error("We could not find that room.");
  return data;
}

/**
 * Submits an enquiry. Anonymous visitors may insert and nothing else, so this
 * deliberately does not chain .select(), because asking for the row back would be
 * rejected by the read policy.
 */
export async function submitReservationRequest(payload) {
  const { error } = await supabase.from("reservation_requests").insert([
    {
      cabin_id: payload.cabinId ?? null,
      full_name: payload.fullName.trim(),
      email: payload.email.trim(),
      phone: payload.phone?.trim() || null,
      start_date: payload.startDate,
      end_date: payload.endDate,
      num_guests: Number(payload.numGuests),
      message: payload.message?.trim() || null,
    },
  ]);

  if (error) {
    if (error.code === "23514") {
      throw new Error(
        "Please check your dates and party size. Something looks out of range."
      );
    }
    throw new Error(describeError(error, "Could not send your enquiry"));
  }
}

/** Net nightly rate after any discount. */
export function nightlyRate(room) {
  return Number(room.regularPrice) - Number(room.discount ?? 0);
}
