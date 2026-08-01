import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  checkInBooking,
  checkOutBooking,
  deleteBooking,
  getBooking,
  getBookings,
} from "../services/bookings";
import notify from "../lib/toast";

export function useBookings(params) {
  return useQuery({
    queryKey: ["bookings", params],
    queryFn: () => getBookings(params),
    // Holding the previous page while the next loads stops the table from
    // collapsing to a spinner on every filter or page change.
    placeholderData: keepPreviousData,
  });
}

export function useBooking(id) {
  return useQuery({
    queryKey: ["booking", String(id)],
    queryFn: () => getBooking(id),
    enabled: Boolean(id),
    retry: false,
  });
}

/** Invalidating both keys keeps the list and any open detail view in step. */
function invalidateBookings(queryClient) {
  queryClient.invalidateQueries({ queryKey: ["bookings"] });
  queryClient.invalidateQueries({ queryKey: ["booking"] });
  queryClient.invalidateQueries({ queryKey: ["dashboard"] });
}

export function useDeleteBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBooking,
    onSuccess: () => {
      notify.success("Booking deleted");
      invalidateBookings(queryClient);
    },
    onError: (error) => notify.error(error.message),
  });
}

export function useCheckIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: checkInBooking,
    onSuccess: () => {
      notify.success("Guest checked in");
      invalidateBookings(queryClient);
    },
    onError: (error) => notify.error(error.message),
  });
}

export function useCheckOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: checkOutBooking,
    onSuccess: () => {
      notify.success("Guest checked out");
      invalidateBookings(queryClient);
    },
    onError: (error) => notify.error(error.message),
  });
}
