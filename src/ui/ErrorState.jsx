import styled from "styled-components";
import { HiOutlineExclamationTriangle } from "react-icons/hi2";
import Button from "./Button";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  text-align: center;
  padding: var(--space-10) var(--space-5);
`;

const IconCircle = styled.div`
  display: grid;
  place-items: center;
  width: 6.4rem;
  height: 6.4rem;
  margin-bottom: var(--space-2);
  border-radius: 50%;
  background-color: var(--danger-soft);
  color: var(--danger-text);

  & svg {
    width: 3rem;
    height: 3rem;
  }
`;

const Title = styled.h3`
  font-size: var(--text-md);
`;

const Message = styled.p`
  font-size: var(--text-sm);
  color: var(--text-muted);
  max-width: 48ch;
`;

const Actions = styled.div`
  margin-top: var(--space-4);
`;

/**
 * Failed queries used to render `<h1>error: [object Object]</h1>`. This shows
 * the real message and offers a retry.
 */
export default function ErrorState({
  title = "Something went wrong",
  error,
  onRetry,
}) {
  const message =
    typeof error === "string" ? error : error?.message ?? "Please try again.";

  return (
    <Wrapper role="alert">
      <IconCircle aria-hidden="true">
        <HiOutlineExclamationTriangle />
      </IconCircle>
      <Title>{title}</Title>
      <Message>{message}</Message>
      {onRetry && (
        <Actions>
          <Button variant="secondary" onClick={onRetry}>
            Try again
          </Button>
        </Actions>
      )}
    </Wrapper>
  );
}
