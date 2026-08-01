import supabase, { describeError } from "../lib/supabase";

export const REQUEST_STATUSES = ["new", "contacted", "confirmed", "declined"];

const COLUMNS = `
  id, created_at, cabin_id, full_name, email, phone,
  start_date, end_date, num_guests, message, status, staff_notes,
  handled_by, handled_at,
  cabins ( id, name, slug, image, "maxCapacity", "regularPrice", discount ),
  staff:handled_by ( id, full_name, email )
`;

export async function getRequests({ status = "all" } = {}) {
  let query = supabase.from("reservation_requests").select(COLUMNS);

  if (REQUEST_STATUSES.includes(status)) {
    query = query.eq("status", status);
  }

  const { data, error } = await query
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) throw new Error(describeError(error, "Could not load enquiries"));
  return data ?? [];
}

/** Count of untouched enquiries, for the sidebar badge. */
export async function getNewRequestCount() {
  const { count, error } = await supabase
    .from("reservation_requests")
    .select("id", { count: "exact", head: true })
    .eq("status", "new");

  if (error) return 0;
  return count ?? 0;
}

export async function updateRequest({ id, ...patch }) {
  // handled_by / handled_at are stamped by a database trigger, not sent here.
  const { data, error } = await supabase
    .from("reservation_requests")
    .update(patch)
    .eq("id", id)
    .select(COLUMNS)
    .single();

  if (error) throw new Error(describeError(error, "Could not update the enquiry"));
  return data;
}

export async function deleteRequest(id) {
  const { error } = await supabase
    .from("reservation_requests")
    .delete()
    .eq("id", id);
  if (error) throw new Error(describeError(error, "Could not delete the enquiry"));
}

/**
 * Turns an enquiry into a real booking. The database function does the work in
 * one transaction: it checks availability and the hotel settings, reuses the
 * guest record if the email is already known, prices the stay, and marks the
 * enquiry confirmed.
 */
export async function convertRequest({ requestId, cabinId, hasBreakfast = false }) {
  const { data, error } = await supabase.rpc("hotel_convert_request", {
    p_request_id: requestId,
    p_cabin_id: cabinId ?? null,
    p_has_breakfast: hasBreakfast,
  });

  if (error) throw new Error(describeError(error, "Could not create the booking"));
  return data;
}

/** Direct booking creation, for walk-ins and phone reservations. */
export async function createBooking(values) {
  const { data, error } = await supabase.rpc("hotel_create_booking", {
    p_cabin_id: values.cabinId,
    p_start_date: values.startDate,
    p_end_date: values.endDate,
    p_num_guests: Number(values.numGuests),
    p_full_name: values.fullName,
    p_email: values.email,
    p_nationality: values.nationality || null,
    p_national_id: values.nationalId || null,
    p_country_flag: values.countryFlag || null,
    p_has_breakfast: Boolean(values.hasBreakfast),
    p_observations: values.observations || null,
  });

  if (error) throw new Error(describeError(error, "Could not create the booking"));
  return data;
}
