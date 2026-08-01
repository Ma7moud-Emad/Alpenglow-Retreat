import styled from "styled-components";
import PageHeader from "../ui/PageHeader";
import useAuth from "../hooks/useAuth";
import ProfileCard from "../features/account/ProfileCard";
import PasswordCard from "../features/account/PasswordCard";

const Stack = styled.div`
  display: grid;
  gap: var(--space-5);
  max-width: 68rem;
`;

export default function Account() {
  const { user, profile } = useAuth();

  return (
    <>
      <PageHeader title="My account" subtitle="Your profile and sign-in details" />
      <Stack>
        <ProfileCard profile={profile} user={user} />
        <PasswordCard />
      </Stack>
    </>
  );
}
