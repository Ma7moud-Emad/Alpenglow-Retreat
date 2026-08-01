import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSettings, updateSettings } from "../services/settings";
import notify from "../lib/toast";

export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
    // Hotel policy changes rarely; no need to refetch it on every screen.
    staleTime: 10 * 60 * 1000,
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSettings,
    onSuccess: (data) => {
      notify.success("Settings saved");
      queryClient.setQueryData(["settings"], data);
    },
    onError: (error) => notify.error(error.message),
  });
}
