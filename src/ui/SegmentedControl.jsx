import styled from "styled-components";

const Group = styled.div`
  display: inline-flex;
  gap: 0.2rem;
  padding: 0.3rem;
  background-color: var(--surface-inset);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  overflow-x: auto;
  max-width: 100%;
`;

const Segment = styled.button`
  padding: 0.6rem var(--space-3);
  border-radius: calc(var(--radius-sm) - 0.2rem);
  font-size: var(--text-sm);
  font-weight: 500;
  white-space: nowrap;
  color: ${({ $active }) => ($active ? "var(--accent-contrast)" : "var(--text-secondary)")};
  background-color: ${({ $active }) => ($active ? "var(--accent)" : "transparent")};
  transition: background-color var(--duration) var(--ease),
    color var(--duration) var(--ease);

  &:hover:not([aria-pressed="true"]) {
    background-color: var(--surface-hover);
    color: var(--text);
  }
`;

/**
 * Filter switcher. Rendered as buttons with aria-pressed rather than the old
 * clickable <li> elements, which were unreachable by keyboard.
 */
export default function SegmentedControl({ options, value, onChange, label }) {
  return (
    <Group role="group" aria-label={label}>
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <Segment
            key={option.value}
            type="button"
            $active={isActive}
            aria-pressed={isActive}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </Segment>
        );
      })}
    </Group>
  );
}
