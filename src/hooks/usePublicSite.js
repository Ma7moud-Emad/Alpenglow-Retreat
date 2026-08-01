import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getPublicRoom,
  getPublicRooms,
  submitReservationRequest,
} from "../services/publicSite";

export function usePublicRooms() {
  return useQuery({
    queryKey: ["public", "rooms"],
    queryFn: getPublicRooms,
    // Marketing content barely changes; don't refetch it on every navigation.
    staleTime: 10 * 60 * 1000,
  });
}

export function usePublicRoom(slug) {
  return useQuery({
    queryKey: ["public", "room", slug],
    queryFn: () => getPublicRoom(slug),
    enabled: Boolean(slug),
    staleTime: 10 * 60 * 1000,
    retry: false,
  });
}

export function useSubmitEnquiry() {
  return useMutation({ mutationFn: submitReservationRequest });
}
