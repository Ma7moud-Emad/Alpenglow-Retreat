import { forwardRef, useId } from "react";
import styled, { css } from "styled-components";

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
`;

export const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  padding-top: var(--space-2);

  @media (max-width: 480px) {
    flex-direction: column-reverse;
  }
`;

const fieldStyles = css`
  width: 100%;
  padding: 0.9rem var(--space-3);
  font-size: var(--text-base);
  color: var(--text);
  background-color: var(--surface);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-sm);
  transition: border-color var(--duration) var(--ease),
    box-shadow var(--duration) var(--ease);

  &::placeholder {
    color: var(--text-muted);
  }

  &:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-ring);
  }

  &:disabled {
    background-color: var(--surface-inset);
    color: var(--text-muted);
  }

  &[aria-invalid="true"] {
    border-color: var(--danger);
    &:focus {
      box-shadow: 0 0 0 3px var(--danger-soft);
    }
  }
`;

export const Input = styled.input`
  ${fieldStyles}

  &[type="file"] {
    padding: 0.6rem;
    cursor: pointer;
  }
  &[type="file"]::file-selector-button {
    margin-right: var(--space-3);
    padding: 0.5rem var(--space-3);
    font: inherit;
    font-weight: 500;
    color: var(--accent-soft-text);
    background-color: var(--accent-soft);
    border: none;
    border-radius: var(--radius-sm);
    cursor: pointer;
  }
`;

export const Textarea = styled.textarea`
  ${fieldStyles}
  min-height: 10rem;
  resize: vertical;
`;

export const Select = styled.select`
  ${fieldStyles}
  cursor: pointer;
  appearance: none;
  padding-right: var(--space-8);
  background-image: linear-gradient(45deg, transparent 50%, currentColor 50%),
    linear-gradient(135deg, currentColor 50%, transparent 50%);
  background-position: calc(100% - 1.8rem) 55%, calc(100% - 1.3rem) 55%;
  background-size: 0.5rem 0.5rem, 0.5rem 0.5rem;
  background-repeat: no-repeat;
`;

export const Label = styled.label`
  display: block;
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 0.6rem;
`;

export const HelpText = styled.p`
  font-size: var(--text-xs);
  color: var(--text-muted);
  margin-top: 0.5rem;
`;

export const ErrorText = styled.p`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: var(--text-xs);
  color: var(--danger-text);
  margin-top: 0.5rem;
`;

const FieldWrapper = styled.div`
  min-width: 0;
`;

/**
 * Wraps a control with its label, hint and error and wires up the aria
 * attributes, so an invalid field is announced rather than just turning red.
 */
export function FormField({ label, error, help, children, htmlFor }) {
  const generatedId = useId();
  const id = htmlFor ?? generatedId;
  const errorId = `${id}-error`;
  const helpId = `${id}-help`;

  return (
    <FieldWrapper>
      {label && <Label htmlFor={id}>{label}</Label>}
      {children({
        id,
        "aria-invalid": error ? "true" : undefined,
        "aria-describedby":
          [error && errorId, help && helpId].filter(Boolean).join(" ") ||
          undefined,
      })}
      {help && !error && <HelpText id={helpId}>{help}</HelpText>}
      {error && (
        <ErrorText id={errorId} role="alert">
          {error}
        </ErrorText>
      )}
    </FieldWrapper>
  );
}

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-3);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background-color: var(--surface-inset);
  cursor: pointer;
  transition: border-color var(--duration) var(--ease);

  &:hover {
    border-color: var(--border-strong);
  }

  & input {
    width: 1.9rem;
    height: 1.9rem;
    margin-top: 0.1rem;
    accent-color: var(--accent);
    cursor: pointer;
    flex-shrink: 0;
  }

  & label {
    margin: 0;
    cursor: pointer;
    color: var(--text);
    font-weight: 400;
    line-height: 1.5;
  }
`;

export const Checkbox = forwardRef(function Checkbox(
  { label, id, ...props },
  ref
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <CheckboxWrapper>
      <input ref={ref} type="checkbox" id={inputId} {...props} />
      <Label as="label" htmlFor={inputId}>
        {label}
      </Label>
    </CheckboxWrapper>
  );
});
