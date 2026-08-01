import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCabin,
  deleteCabin,
  duplicateCabin,
  getCabins,
  updateCabin,
} from "../services/cabins";
import notify from "../lib/toast";

export function useCabins(params) {
  return useQuery({
    queryKey: ["cabins", params],
    queryFn: () => getCabins(params),
  });
}

function useCabinMutation(mutationFn, successMessage) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      notify.success(successMessage);
      queryClient.invalidateQueries({ queryKey: ["cabins"] });
    },
    onError: (error) => notify.error(error.message),
  });
}

export function useCreateCabin() {
  return useCabinMutation(createCabin, "Cabin created");
}

export function useUpdateCabin() {
  return useCabinMutation(updateCabin, "Cabin updated");
}

export function useDeleteCabin() {
  return useCabinMutation(deleteCabin, "Cabin deleted");
}

export function useDuplicateCabin() {
  return useCabinMutation(duplicateCabin, "Cabin duplicated");
}
