import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import AuthShell from "../features/auth/AuthShell";
import Button from "../ui/Button";
import { Form, FormField, Input } from "../ui/Form";
import supabase, { describeError } from "../lib/supabase";
import notify from "../lib/toast";
import PageMeta from "../ui/PageMeta";

/**
 * Landing page for the emailed reset link. Supabase turns the recovery token in
 * the URL into a temporary session, so updateUser is all that is needed here;
 * the current password cannot be asked for, because the user has forgotten it.
 */
export default function ResetPassword() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  const { mutate: setPassword, isPending } = useMutation({
    mutationFn: async ({ newPassword }) => {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw new Error(describeError(error, "Could not set the password"));
    },
    onSuccess: () => {
      notify.success("Password updated, you are signed in");
      navigate("/admin/dashboard", { replace: true });
    },
    onError: (error) => notify.error(error.message),
  });

  return (
    <AuthShell
      title="Choose a new password"
      subtitle="Pick something you have not used here before."
    >
      <PageMeta title="Choose a new password" path="/reset-password" noIndex />

      <Form onSubmit={handleSubmit((values) => setPassword(values))} noValidate>
        <FormField
          label="New password"
          help="At least 8 characters"
          error={errors.newPassword?.message}
        >
          {(field) => (
            <Input
              {...field}
              type="password"
              autoComplete="new-password"
              {...register("newPassword", {
                required: "Choose a password",
                minLength: { value: 8, message: "At least 8 characters" },
              })}
            />
          )}
        </FormField>

        <FormField label="Confirm password" error={errors.confirmPassword?.message}>
          {(field) => (
            <Input
              {...field}
              type="password"
              autoComplete="new-password"
              {...register("confirmPassword", {
                required: "Confirm the password",
                validate: (value) =>
                  value === getValues("newPassword") ||
                  "The passwords do not match",
              })}
            />
          )}
        </FormField>

        <Button type="submit" size="lg" fullWidth isLoading={isPending}>
          Save password
        </Button>
      </Form>
    </AuthShell>
  );
}
