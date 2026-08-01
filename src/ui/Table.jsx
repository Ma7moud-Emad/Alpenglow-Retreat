import styled from "styled-components";

/**
 * A data table that becomes a stacked card list on narrow screens.
 *
 * Each <Td> carries a `data-label`, which the mobile layout promotes into a
 * leading label, so the same markup reads correctly at both sizes without a
 * second component tree.
 */
const Scroller = styled.div`
  width: 100%;
  overflow-x: auto;
`;

export const Table = styled.table`
  width: 100%;
  font-size: var(--text-sm);

  @media (max-width: 900px) {
    display: block;
  }
`;

export const Thead = styled.thead`
  @media (max-width: 900px) {
    /* Visually hidden, still announced: the labels move into the cells. */
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }
`;

export const Tbody = styled.tbody`
  @media (max-width: 900px) {
    display: block;
  }
`;

export const Tr = styled.tr`
  border-bottom: 1px solid var(--border);
  transition: background-color var(--duration) var(--ease);

  tbody &:hover {
    background-color: var(--surface-hover);
  }
  tbody &:last-child {
    border-bottom: none;
  }

  @media (max-width: 900px) {
    display: grid;
    gap: var(--space-2);
    padding: var(--space-4);
    border-bottom: 1px solid var(--border);
  }
`;

export const Th = styled.th`
  padding: var(--space-3) var(--space-4);
  text-align: ${({ $align }) => $align ?? "left"};
  font-size: var(--text-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  background-color: var(--surface-inset);
  white-space: nowrap;

  &:first-child {
    padding-left: var(--space-5);
  }
  &:last-child {
    padding-right: var(--space-5);
  }
`;

export const Td = styled.td`
  padding: var(--space-3) var(--space-4);
  text-align: ${({ $align }) => $align ?? "left"};
  vertical-align: middle;
  color: var(--text-secondary);

  &:first-child {
    padding-left: var(--space-5);
  }
  &:last-child {
    padding-right: var(--space-5);
  }

  @media (max-width: 900px) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-4);
    padding: 0;
    text-align: right;

    &::before {
      content: attr(data-label);
      font-size: var(--text-xs);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--text-muted);
      text-align: left;
    }

    &:empty {
      display: none;
    }
  }
`;

export default function DataTable({ children, ...props }) {
  return (
    <Scroller>
      <Table {...props}>{children}</Table>
    </Scroller>
  );
}
