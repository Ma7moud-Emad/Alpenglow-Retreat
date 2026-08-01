import styled, { css } from "styled-components";
import Spinner from "./Spinner";

const variants = {
  primary: css`
    background-color: var(--accent);
    color: var(--accent-contrast);
    &:hover:not(:disabled) {
      background-color: var(--accent-hover);
    }
  `,
  secondary: css`
    background-color: var(--surface);
    color: var(--text-secondary);
    border-color: var(--border-strong);
    &:hover:not(:disabled) {
      background-color: var(--surface-hover);
      color: var(--text);
    }
  `,
  ghost: css`
    background-color: transparent;
    color: var(--text-secondary);
    &:hover:not(:disabled) {
      background-color: var(--surface-hover);
      color: var(--text);
    }
  `,
  danger: css`
    background-color: var(--danger);
    color: var(--danger-contrast);
    &:hover:not(:disabled) {
      background-color: var(--danger-hover);
    }
  `,
  "danger-soft": css`
    background-color: var(--danger-soft);
    color: var(--danger-text);
    &:hover:not(:disabled) {
      background-color: var(--danger);
      color: var(--danger-contrast);
    }
  `,
  success: css`
    background-color: var(--success-soft);
    color: var(--success-text);
    &:hover:not(:disabled) {
      background-color: var(--success-text);
      color: var(--text-inverted);
    }
  `,
};

const sizes = {
  sm: css`
    padding: 0.5rem var(--space-3);
    font-size: var(--text-sm);
    min-height: 3.2rem;
  `,
  md: css`
    padding: 0.8rem var(--space-4);
    font-size: var(--text-base);
    min-height: 4rem;
  `,
  lg: css`
    padding: 1.1rem var(--space-5);
    font-size: var(--text-md);
    min-height: 4.8rem;
  `,
};

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  border-radius: var(--radius-sm);
  border: 1px solid transparent;
  font-weight: 500;
  white-space: nowrap;
  transition: background-color var(--duration) var(--ease),
    color var(--duration) var(--ease), border-color var(--duration) var(--ease),
    opacity var(--duration) var(--ease);

  ${({ $variant }) => variants[$variant] ?? variants.primary}
  ${({ $size }) => sizes[$size] ?? sizes.md}
  ${({ $full }) =>
    $full &&
    css`
      width: 100%;
    `}
  ${({ $iconOnly }) =>
    $iconOnly &&
    css`
      padding: 0;
      aspect-ratio: 1;
    `}

  & svg {
    width: 1.7em;
    height: 1.7em;
    flex-shrink: 0;
  }

  &:disabled {
    opacity: 0.55;
  }
`;

/**
 * `isLoading` disables the button and swaps its label for a spinner, so a
 * double submit is impossible while a mutation is in flight.
 */
export default function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  fullWidth = false,
  iconOnly = false,
  disabled,
  ...props
}) {
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $full={fullWidth}
      $iconOnly={iconOnly}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {isLoading ? <Spinner /> : children}
    </StyledButton>
  );
}
