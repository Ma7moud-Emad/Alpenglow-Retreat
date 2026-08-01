import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  convertRequest,
  createBooking,
  deleteRequest,
  getNewRequestCount,
  getRequests,
  updateRequest,
} from "../services/requests";
import notify from "../lib/toast";

export function useRequests(params) {
  return useQuery({
    queryKey: ["requests", params],
    queryFn: () => getRequests(params),
  });
}

export function useNewRequestCount() {
  return useQuery({
    queryKey: ["requests", "new-count"],
    queryFn: getNewRequestCount,
    staleTime: 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });
}

function useRequestMutation(mutationFn, successMessage) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      notify.success(successMessage);
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      // A conversion creates a booking, so those views are stale too.
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (error) => notify.error(error.message),
  });
}

export function useUpdateRequest() {
  return useRequestMutation(updateRequest, "Enquiry updated");
}

export function useDeleteRequest() {
  return useRequestMutation(deleteRequest, "Enquiry deleted");
}

export function useConvertRequest() {
  return useRequestMutation(convertRequest, "Booking created from enquiry");
}

export function useCreateBooking() {
  return useRequestMutation(createBooking, "Booking created");
}
