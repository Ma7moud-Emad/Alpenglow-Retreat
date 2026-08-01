import styled, { css } from "styled-components";

const tones = {
  neutral: css`
    background-color: var(--neutral-soft);
    color: var(--neutral-text);
  `,
  accent: css`
    background-color: var(--accent-soft);
    color: var(--accent-soft-text);
  `,
  success: css`
    background-color: var(--success-soft);
    color: var(--success-text);
  `,
  warning: css`
    background-color: var(--warning-soft);
    color: var(--warning-text);
  `,
  danger: css`
    background-color: var(--danger-soft);
    color: var(--danger-text);
  `,
  info: css`
    background-color: var(--info-soft);
    color: var(--info-text);
  `,
};

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.3rem var(--space-2);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.01em;
  white-space: nowrap;
  text-transform: capitalize;

  ${({ $tone }) => tones[$tone] ?? tones.neutral}
`;

/** Booking status has one colour meaning across the whole app. */
const STATUS_TONES = {
  unconfirmed: "info",
  "checked in": "success",
  "checked out": "neutral",
};

export function StatusBadge({ status }) {
  return <Badge $tone={STATUS_TONES[status] ?? "neutral"}>{status}</Badge>;
}

export default Badge;
