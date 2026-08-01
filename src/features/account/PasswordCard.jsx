import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import Card, { CardBody, CardHeader, CardTitle, CardDescription } from "../../ui/Card";
import Button from "../../ui/Button";
import { Form, FormActions, FormField, Input } from "../../ui/Form";
import { changePassword } from "../../services/auth";
import notify from "../../lib/toast";

export default function PasswordCard() {
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm();

  const { mutate: change, isPending } = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      notify.success("Password updated");
      reset();
    },
    onError: (error) => notify.error(error.message),
  });

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Password</CardTitle>
          <CardDescription>
            Your current password is required to set a new one.
          </CardDescription>
        </div>
      </CardHeader>

      <CardBody>
        <Form onSubmit={handleSubmit((values) => change(values))} noValidate>
          <FormField label="Current password" error={errors.currentPassword?.message}>
            {(field) => (
              <Input
                {...field}
                type="password"
                autoComplete="current-password"
                {...register("currentPassword", {
                  required: "Enter your current password",
                })}
              />
            )}
          </FormField>

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
                  required: "Choose a new password",
                  minLength: { value: 8, message: "At least 8 characters" },
                  validate: (value) =>
                    value !== getValues("currentPassword") ||
                    "The new password must be different",
                })}
              />
            )}
          </FormField>

          <FormField label="Confirm new password" error={errors.confirmPassword?.message}>
            {(field) => (
              <Input
                {...field}
                type="password"
                autoComplete="new-password"
                {...register("confirmPassword", {
                  required: "Confirm the new password",
                  validate: (value) =>
                    value === getValues("newPassword") ||
                    "The passwords do not match",
                })}
              />
            )}
          </FormField>

          <FormActions>
            <Button type="submit" isLoading={isPending}>
              Update password
            </Button>
          </FormActions>
        </Form>
      </CardBody>
    </Card>
  );
}
