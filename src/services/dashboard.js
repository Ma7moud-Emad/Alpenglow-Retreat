import supabase, { describeError } from "../lib/supabase";
import { subtractDays, toISODate } from "../lib/format";

export const DASHBOARD_RANGES = [
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
];

export function rangeToDates(days) {
  const span = Number(days);
  const safeSpan = DASHBOARD_RANGES.some((r) => r.value === String(span))
    ? span
    : 30;
  return {
    from: toISODate(subtractDays(new Date(), safeSpan - 1)),
    to: toISODate(new Date()),
  };
}

/**
 * All four of these aggregate in Postgres. The dashboard previously pulled
 * every booking row for the window and reduced over it in the browser, which
 * meant transferring hundreds of records to render five numbers.
 */
export async function getDashboardStats(days) {
  const { from, to } = rangeToDates(days);
  const { data, error } = await supabase
    .rpc("hotel_dashboard_stats", { p_from: from, p_to: to })
    .single();

  if (error) throw new Error(describeError(error, "Could not load statistics"));
  return data;
}

export async function getSalesSeries(days) {
  const { from, to } = rangeToDates(days);
  const { data, error } = await supabase.rpc("hotel_sales_series", {
    p_from: from,
    p_to: to,
  });

  if (error) throw new Error(describeError(error, "Could not load the sales chart"));
  return data ?? [];
}

export async function getStayDuration(days) {
  const { from, to } = rangeToDates(days);
  const { data, error } = await supabase.rpc("hotel_stay_duration", {
    p_from: from,
    p_to: to,
  });

  if (error) throw new Error(describeError(error, "Could not load stay durations"));
  return data ?? [];
}

export async function getTodayActivity() {
  const { data, error } = await supabase.rpc("hotel_today_activity");
  if (error) throw new Error(describeError(error, "Could not load today's activity"));
  return data ?? [];
}
