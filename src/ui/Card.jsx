import styled from "styled-components";

const Card = styled.section`
  background-color: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
`;

export const CardHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-5);
  border-bottom: 1px solid var(--border);
`;

export const CardTitle = styled.h2`
  font-size: var(--text-md);
  font-weight: 600;
`;

export const CardDescription = styled.p`
  font-size: var(--text-sm);
  color: var(--text-muted);
  margin-top: 0.2rem;
`;

export const CardBody = styled.div`
  padding: var(--space-5);
`;

export default Card;
