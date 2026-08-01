import styled from "styled-components";

const Wrapper = styled.header`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-4);
  flex-wrap: wrap;
  margin-bottom: var(--space-5);
`;

const Heading = styled.div`
  min-width: 0;
`;

const Title = styled.h1`
  font-size: var(--text-2xl);
  letter-spacing: -0.02em;
`;

const Subtitle = styled.p`
  font-size: var(--text-base);
  color: var(--text-muted);
  margin-top: 0.4rem;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-wrap: wrap;
`;

export default function PageHeader({ title, subtitle, children }) {
  return (
    <Wrapper>
      <Heading>
        <Title>{title}</Title>
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
      </Heading>
      {children && <Actions>{children}</Actions>}
    </Wrapper>
  );
}
