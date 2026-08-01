import { useForm } from "react-hook-form";
import Modal from "../../ui/Modal";
import Button from "../../ui/Button";
import { Form, FormActions, FormField, Input, Select } from "../../ui/Form";
import { useCreateStaff } from "../../hooks/useStaff";

/**
 * Creating an account no longer calls supabase.auth.signUp from the browser, which
 * swapped the current session for the new user's. This posts to the
 * staff-admin edge function, so the admin stays signed in.
 */
export default function AddStaffForm({ isOpen, onClose }) {
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({ defaultValues: { role: "staff" } });

  const { mutate: create, isPending } = useCreateStaff();

  function close() {
    reset();
    onClose();
  }

  function onSubmit(values) {
    create(
      {
        email: values.email.trim(),
        password: values.password,
        fullName: values.fullName.trim(),
        role: values.role,
      },
      { onSuccess: close }
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={close}
      title="Add a team member"
      description="They can sign in straight away with the password you set here."
      width="52rem"
    >
      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormField label="Full name" error={errors.fullName?.message}>
          {(field) => (
            <Input
              {...field}
              type="text"
              autoComplete="off"
              {...register("fullName", { required: "Enter their name" })}
            />
          )}
        </FormField>

        <FormField label="Email" error={errors.email?.message}>
          {(field) => (
            <Input
              {...field}
              type="email"
              autoComplete="off"
              {...register("email", {
                required: "Enter an email address",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
                  message: "That does not look like an email address",
                },
              })}
            />
          )}
        </FormField>

        <FormField
          label="Temporary password"
          help="At least 8 characters. Ask them to change it after signing in."
          error={errors.password?.message}
        >
          {(field) => (
            <Input
              {...field}
              type="password"
              autoComplete="new-password"
              {...register("password", {
                required: "Set a password",
                minLength: { value: 8, message: "At least 8 characters" },
              })}
            />
          )}
        </FormField>

        <FormField
          label="Confirm password"
          error={errors.confirmPassword?.message}
        >
          {(field) => (
            <Input
              {...field}
              type="password"
              autoComplete="new-password"
              {...register("confirmPassword", {
                required: "Confirm the password",
                validate: (value) =>
                  value === getValues("password") || "The passwords do not match",
              })}
            />
          )}
        </FormField>

        <FormField
          label="Role"
          help="Admins can change settings, manage the team, and delete records."
        >
          {(field) => (
            <Select {...field} {...register("role")}>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </Select>
          )}
        </FormField>

        <FormActions>
          <Button type="button" variant="secondary" onClick={close} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isPending}>
            Add member
          </Button>
        </FormActions>
      </Form>
    </Modal>
  );
}
