import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createStaffMember,
  deleteStaffMember,
  getStaff,
  setStaffRole,
  updateMyProfile,
} from "../services/staff";
import notify from "../lib/toast";

export function useStaff() {
  return useQuery({
    queryKey: ["staff", "list"],
    queryFn: getStaff,
  });
}

function useStaffMutation(mutationFn, successMessage) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      notify.success(successMessage);
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
    onError: (error) => notify.error(error.message),
  });
}

export function useCreateStaff() {
  return useStaffMutation(createStaffMember, "Team member added");
}

export function useDeleteStaff() {
  return useStaffMutation(deleteStaffMember, "Team member removed");
}

export function useSetStaffRole() {
  return useStaffMutation(setStaffRole, "Role updated");
}

export function useUpdateProfile() {
  return useStaffMutation(updateMyProfile, "Profile saved");
}
