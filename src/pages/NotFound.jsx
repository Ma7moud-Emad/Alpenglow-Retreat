import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "../ui/Button";
import PageMeta from "../ui/PageMeta";

const Page = styled.div`
  display: grid;
  place-items: center;
  min-height: 100dvh;
  padding: var(--space-5);
  text-align: center;
`;

const Inner = styled.div`
  max-width: 52rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
`;

const Code = styled.p`
  font-size: var(--text-3xl);
  font-weight: 700;
  letter-spacing: -0.04em;
  color: var(--accent);
`;

const Title = styled.h1`
  font-size: var(--text-xl);
`;

const Message = styled.p`
  color: var(--text-muted);
`;

const Actions = styled.div`
  display: flex;
  gap: var(--space-3);
  margin-top: var(--space-4);
  flex-wrap: wrap;
  justify-content: center;
`;

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Page>
      <PageMeta title="Page not found" path="/404" noIndex />

      <Inner>
        <Code>404</Code>
        <Title>We can't find that page</Title>
        <Message>
          The link may be out of date, or the record it pointed to has since been
          deleted.
        </Message>
        <Actions>
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Go back
          </Button>
          <Button as={Link} to="/admin/dashboard">
            Open dashboard
          </Button>
        </Actions>
      </Inner>
    </Page>
  );
}
