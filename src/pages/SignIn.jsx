import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { HiOutlineArrowLeft } from "react-icons/hi2";
import AuthShell from "../features/auth/AuthShell";
import Button from "../ui/Button";
import { Form, FormField, Input } from "../ui/Form";
import { requestPasswordReset, signIn } from "../services/auth";
import notify from "../lib/toast";
import PageMeta from "../ui/PageMeta";

const LinkButton = styled.button`
  font-size: var(--text-sm);
  color: var(--accent);
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-3);
  margin-top: calc(var(--space-2) * -1);
`;

const Sent = styled.p`
  padding: var(--space-3);
  border-radius: var(--radius-sm);
  background-color: var(--success-soft);
  color: var(--success-text);
  font-size: var(--text-sm);
`;

export default function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState("signin");
  const [resetSent, setResetSent] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  const { mutate: doSignIn, isPending: isSigningIn } = useMutation({
    mutationFn: signIn,
    onSuccess: () => {
      // Return them to whatever they were trying to reach before the redirect.
      const destination = location.state?.from?.pathname ?? "/admin/dashboard";
      navigate(destination, { replace: true });
    },
    onError: (error) => notify.error(error.message),
  });

  const { mutate: doReset, isPending: isSendingReset } = useMutation({
    mutationFn: requestPasswordReset,
    onSuccess: () => setResetSent(true),
    onError: (error) => notify.error(error.message),
  });

  const isForgot = mode === "forgot";

  return (
    <AuthShell
      title={isForgot ? "Reset your password" : "Welcome back"}
      subtitle={
        isForgot
          ? "We'll email you a link to choose a new password."
          : "Sign in to the hotel management dashboard."
      }
    >
      <PageMeta title="Staff sign in" path="/signin" noIndex />

      {isForgot && resetSent ? (
        <>
          <Sent>
            If an account exists for {getValues("email")}, a reset link is on its
            way. The link expires in one hour.
          </Sent>
          <Button
            variant="secondary"
            fullWidth
            onClick={() => {
              setMode("signin");
              setResetSent(false);
            }}
          >
            <HiOutlineArrowLeft /> Back to sign in
          </Button>
        </>
      ) : (
        <Form
          onSubmit={handleSubmit((values) =>
            isForgot ? doReset(values.email) : doSignIn(values)
          )}
          noValidate
        >
          <FormField label="Email" error={errors.email?.message}>
            {(field) => (
              <Input
                {...field}
                type="email"
                autoComplete="username"
                placeholder="you@alpenglow.test"
                {...register("email", {
                  required: "Enter your email address",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
                    message: "That does not look like an email address",
                  },
                })}
              />
            )}
          </FormField>

          {!isForgot && (
            <FormField label="Password" error={errors.password?.message}>
              {(field) => (
                <Input
                  {...field}
                  type="password"
                  autoComplete="current-password"
                  {...register("password", {
                    required: "Enter your password",
                  })}
                />
              )}
            </FormField>
          )}

          <Row>
            <LinkButton
              type="button"
              onClick={() => setMode(isForgot ? "signin" : "forgot")}
            >
              {isForgot ? "Back to sign in" : "Forgot your password?"}
            </LinkButton>
          </Row>

          <Button
            type="submit"
            size="lg"
            fullWidth
            isLoading={isForgot ? isSendingReset : isSigningIn}
          >
            {isForgot ? "Send reset link" : "Sign in"}
          </Button>
        </Form>
      )}
    </AuthShell>
  );
}
