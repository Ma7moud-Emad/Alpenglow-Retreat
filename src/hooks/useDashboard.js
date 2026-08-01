import { useQueries, useQuery } from "@tanstack/react-query";
import {
  getDashboardStats,
  getSalesSeries,
  getStayDuration,
  getTodayActivity,
} from "../services/dashboard";

/**
 * The four dashboard panels load in parallel and render independently, so a
 * slow chart never holds up the stat tiles.
 */
export function useDashboard(range) {
  const results = useQueries({
    queries: [
      {
        queryKey: ["dashboard", "stats", range],
        queryFn: () => getDashboardStats(range),
      },
      {
        queryKey: ["dashboard", "sales", range],
        queryFn: () => getSalesSeries(range),
      },
      {
        queryKey: ["dashboard", "stays", range],
        queryFn: () => getStayDuration(range),
      },
    ],
  });

  const [stats, sales, stays] = results;

  return {
    stats: stats.data,
    sales: sales.data ?? [],
    stays: stays.data ?? [],
    isPending: results.some((result) => result.isPending),
    error: results.find((result) => result.error)?.error ?? null,
    refetch: () => results.forEach((result) => result.refetch()),
  };
}

export function useTodayActivity() {
  return useQuery({
    queryKey: ["dashboard", "today"],
    queryFn: getTodayActivity,
    // Arrivals and departures shift through the day as the desk works.
    staleTime: 60 * 1000,
  });
}
