import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import styled from "styled-components";
import { HiOutlineCamera } from "react-icons/hi2";
import Card, { CardBody, CardHeader, CardTitle, CardDescription } from "../../ui/Card";
import Button from "../../ui/Button";
import Avatar from "../../ui/Avatar";
import Badge from "../../ui/Badge";
import { Form, FormActions, FormField, Input } from "../../ui/Form";
import { useUpdateProfile } from "../../hooks/useStaff";
import { uploadAvatar } from "../../services/auth";
import notify from "../../lib/toast";
import { formatDateTime } from "../../lib/format";

const AvatarRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding-bottom: var(--space-5);
  margin-bottom: var(--space-5);
  border-bottom: 1px solid var(--border);
  flex-wrap: wrap;
`;

const Meta = styled.dl`
  display: grid;
  grid-template-columns: minmax(11rem, auto) 1fr;
  gap: var(--space-2) var(--space-4);
  font-size: var(--text-sm);
  margin-top: var(--space-5);
  padding-top: var(--space-5);
  border-top: 1px solid var(--border);

  & dt {
    color: var(--text-muted);
  }
  & dd {
    color: var(--text);
    word-break: break-all;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

export default function ProfileCard({ profile, user }) {
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);

  const { mutate: save, isPending } = useUpdateProfile();
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm({ defaultValues: { fullName: profile?.full_name ?? "" } });

  async function handleAvatarChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      notify.error("Choose an image file");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      notify.error("Images must be under 2 MB");
      return;
    }

    setIsUploading(true);
    try {
      const avatarUrl = await uploadAvatar(file, user.id);
      save(
        { avatarUrl },
        { onSuccess: () => queryClient.invalidateQueries({ queryKey: ["staff"] }) }
      );
    } catch (error) {
      notify.error(error.message);
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  }

  function onSubmit(values) {
    save(
      { fullName: values.fullName.trim() },
      { onSuccess: () => reset({ fullName: values.fullName.trim() }) }
    );
  }

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Profile</CardTitle>
          <CardDescription>How you appear to the rest of the team</CardDescription>
        </div>
        <Badge $tone={profile?.role === "admin" ? "accent" : "neutral"}>
          {profile?.role ?? "staff"}
        </Badge>
      </CardHeader>

      <CardBody>
        <AvatarRow>
          <Avatar
            src={profile?.avatar_url}
            name={profile?.full_name || user?.email}
            size="7.2rem"
          />
          <div>
            <Button
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
              isLoading={isUploading}
            >
              <HiOutlineCamera /> Change photo
            </Button>
            <HiddenInput
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
            />
          </div>
        </AvatarRow>

        <Form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormField label="Full name" error={errors.fullName?.message}>
            {(field) => (
              <Input
                {...field}
                type="text"
                autoComplete="name"
                {...register("fullName", {
                  required: "Enter your name",
                  minLength: { value: 2, message: "At least 2 characters" },
                })}
              />
            )}
          </FormField>

          <FormActions>
            <Button type="submit" isLoading={isPending} disabled={!isDirty}>
              Save profile
            </Button>
          </FormActions>
        </Form>

        <Meta>
          <dt>Email</dt>
          <dd>{user?.email}</dd>
          <dt>Email verified</dt>
          <dd>
            <Badge $tone={user?.email_confirmed_at ? "success" : "warning"}>
              {user?.email_confirmed_at ? "Verified" : "Unverified"}
            </Badge>
          </dd>
          <dt>Account created</dt>
          <dd>{formatDateTime(user?.created_at)}</dd>
          <dt>Last signed in</dt>
          <dd>{formatDateTime(user?.last_sign_in_at)}</dd>
        </Meta>
      </CardBody>
    </Card>
  );
}
