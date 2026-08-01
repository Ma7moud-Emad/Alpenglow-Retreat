import styled from "styled-components";
import { Link } from "react-router-dom";

/**
 * The Alpenglow mark, drawn rather than imported: a ridgeline with the sun
 * cresting behind it. Being inline SVG it inherits currentColor, so the same
 * component works on the dark hero and the light header without a second asset.
 */
const Wrapper = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  color: inherit;
`;

const Mark = styled.svg`
  width: 3.4rem;
  height: 3.4rem;
  flex-shrink: 0;
  overflow: visible;
`;

const Text = styled.span`
  display: flex;
  flex-direction: column;
  line-height: 1;

  & strong {
    font-family: var(--font-display);
    font-weight: 500;
    font-size: ${({ $compact }) => ($compact ? "1.9rem" : "2.1rem")};
    letter-spacing: -0.01em;
  }
  & small {
    font-size: 0.95rem;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    opacity: 0.6;
    margin-top: 0.5rem;
  }

  @media (max-width: 520px) {
    & small {
      display: none;
    }
  }
`;

export default function Wordmark({ compact = false, to = "/" }) {
  return (
    <Wrapper to={to} aria-label="Alpenglow Retreat home">
      <Mark viewBox="0 0 40 40" aria-hidden="true" fill="none">
        <circle cx="20" cy="17" r="7.5" fill="var(--ember-400)" />
        <path
          d="M2 32 L13.5 15 L20.5 25 L26 17 L38 32 Z"
          fill="currentColor"
        />
        <path d="M2 32 H38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </Mark>
      <Text $compact={compact}>
        <strong>Alpenglow</strong>
        <small>Retreat</small>
      </Text>
    </Wrapper>
  );
}
