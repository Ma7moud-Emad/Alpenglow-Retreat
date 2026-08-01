import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  text-align: center;
  padding: var(--space-12) var(--space-5);
  color: var(--text-muted);
`;

const IconCircle = styled.div`
  display: grid;
  place-items: center;
  width: 6.4rem;
  height: 6.4rem;
  margin-bottom: var(--space-2);
  border-radius: 50%;
  background-color: var(--surface-inset);
  color: var(--text-muted);

  & svg {
    width: 2.8rem;
    height: 2.8rem;
  }
`;

const Title = styled.h3`
  font-size: var(--text-md);
  color: var(--text);
`;

const Description = styled.p`
  font-size: var(--text-sm);
  max-width: 44ch;
`;

const Action = styled.div`
  margin-top: var(--space-4);
`;

/**
 * Replaces the old "not found items" placeholder. An empty list should say why
 * it is empty and offer the next step.
 */
export default function EmptyState({ icon, title, description, action }) {
  return (
    <Wrapper>
      {icon && <IconCircle aria-hidden="true">{icon}</IconCircle>}
      <Title>{title}</Title>
      {description && <Description>{description}</Description>}
      {action && <Action>{action}</Action>}
    </Wrapper>
  );
}
