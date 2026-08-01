import supabase, { describeError } from "../lib/supabase";

export const PAGE_SIZE = 12;

export const BOOKING_STATUSES = ["unconfirmed", "checked in", "checked out"];

/**
 * Whitelisted sorts. The value is what appears in the URL, so it has to be
 * validated before it reaches the query builder.
 */
export const BOOKING_SORTS = [
  { value: "created_at-desc", label: "Newest first" },
  { value: "created_at-asc", label: "Oldest first" },
  { value: "startDate-asc", label: "Arrival date (soonest)" },
  { value: "startDate-desc", label: "Arrival date (latest)" },
  { value: "totalPrice-desc", label: "Amount (high to low)" },
  { value: "totalPrice-asc", label: "Amount (low to high)" },
  { value: "numNights-desc", label: "Longest stay" },
];

const SORTABLE_COLUMNS = new Set([
  "created_at",
  "startDate",
  "totalPrice",
  "numNights",
]);

function parseSort(sort) {
  const [column, direction] = String(sort ?? "").split("-");
  if (!SORTABLE_COLUMNS.has(column)) {
    return { column: "created_at", ascending: false };
  }
  return { column, ascending: direction === "asc" };
}

// One round trip instead of the previous 1 + 2N: the list used to fetch every
// booking, then a cabin and a guest per row.
const BOOKING_COLUMNS = `
  id, created_at, "startDate", "endDate", "numNights", "numGuests",
  "cabinPrice", "extrasPrice", "totalPrice", status, "hasBreakfast",
  "isPaid", observations, "cabinId", "guestId",
  cabins ( id, name, image, "regularPrice", discount, "maxCapacity", description ),
  guests ( id, "fullName", email, "nationalID", nationality, "countryFlag" )
`;

export async function getBookings({
  status = "all",
  sort = "created_at-desc",
  page = 1,
  search = "",
} = {}) {
  const { column, ascending } = parseSort(sort);
  const term = search.trim();

  // An inner join is required to filter the parent by guest columns; without a
  // search term the join stays outer so bookings are never silently dropped.
  const guestJoin = term ? "guests!inner" : "guests";
  const select = BOOKING_COLUMNS.replace("guests (", `${guestJoin} (`);

  let query = supabase.from("bookings").select(select, { count: "exact" });

  if (BOOKING_STATUSES.includes(status)) {
    query = query.eq("status", status);
  }

  if (term) {
    query = query.or(`fullName.ilike.%${term}%,email.ilike.%${term}%`, {
      referencedTable: "guests",
    });
  }

  const safePage = Math.max(1, Number(page) || 1);
  const from = (safePage - 1) * PAGE_SIZE;

  query = query
    .order(column, { ascending })
    .order("id", { ascending: false })
    .range(from, from + PAGE_SIZE - 1);

  const { data, error, count } = await query;
  if (error) throw new Error(describeError(error, "Could not load bookings"));

  return {
    bookings: data ?? [],
    count: count ?? 0,
    pageCount: Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE)),
    page: safePage,
  };
}

export async function getBooking(id) {
  const { data, error } = await supabase
    .from("bookings")
    .select(BOOKING_COLUMNS)
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") throw new Error("That booking no longer exists");
    throw new Error(describeError(error, "Could not load the booking"));
  }
  return data;
}

export async function deleteBooking(id) {
  const { error } = await supabase.from("bookings").delete().eq("id", id);
  if (error) throw new Error(describeError(error, "Could not delete the booking"));
}

/**
 * Both transitions run in the database so the status machine and the breakfast
 * charge are enforced for every client, not just this one.
 */
export async function checkInBooking({ id, addBreakfast = false }) {
  const { data, error } = await supabase.rpc("hotel_check_in_booking", {
    p_booking_id: id,
    p_add_breakfast: addBreakfast,
  });
  if (error) throw new Error(describeError(error, "Could not check the guest in"));
  return data;
}

export async function checkOutBooking(id) {
  const { data, error } = await supabase.rpc("hotel_check_out_booking", {
    p_booking_id: id,
  });
  if (error) throw new Error(describeError(error, "Could not check the guest out"));
  return data;
}
