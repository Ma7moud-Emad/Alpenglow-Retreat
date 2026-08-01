import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { HiOutlineEllipsisVertical } from "react-icons/hi2";

const Wrapper = styled.div`
  position: relative;
  display: inline-flex;
`;

const Trigger = styled.button`
  display: grid;
  place-items: center;
  width: 3.2rem;
  height: 3.2rem;
  border-radius: var(--radius-sm);
  color: var(--text-muted);
  transition: background-color var(--duration) var(--ease);

  &:hover,
  &[aria-expanded="true"] {
    background-color: var(--surface-hover);
    color: var(--text);
  }
  & svg {
    width: 1.9rem;
    height: 1.9rem;
  }
`;

const List = styled.ul`
  position: absolute;
  top: calc(100% + 0.4rem);
  right: 0;
  z-index: 20;
  min-width: 18rem;
  padding: 0.5rem;
  background-color: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
`;

const Item = styled.li`
  & > button {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    width: 100%;
    padding: 0.8rem var(--space-3);
    border-radius: var(--radius-sm);
    font-size: var(--text-sm);
    text-align: left;
    color: ${({ $danger }) => ($danger ? "var(--danger-text)" : "var(--text-secondary)")};
    transition: background-color var(--duration) var(--ease);

    &:hover:not(:disabled) {
      background-color: ${({ $danger }) =>
        $danger ? "var(--danger-soft)" : "var(--surface-hover)"};
      color: ${({ $danger }) => ($danger ? "var(--danger-text)" : "var(--text)")};
    }
    &:disabled {
      opacity: 0.5;
    }
    & svg {
      width: 1.7rem;
      height: 1.7rem;
      flex-shrink: 0;
    }
  }
`;

/**
 * Row action menu. Collapses the per-row button cluster on dense tables and
 * closes on outside click or Escape.
 */
export default function Menu({ label = "Row actions", children }) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const onPointerDown = (event) => {
      if (!wrapperRef.current?.contains(event.target)) setIsOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  return (
    <Wrapper ref={wrapperRef}>
      <Trigger
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={label}
        onClick={() => setIsOpen((open) => !open)}
      >
        <HiOutlineEllipsisVertical />
      </Trigger>
      {isOpen && (
        <List role="menu" onClick={() => setIsOpen(false)}>
          {children}
        </List>
      )}
    </Wrapper>
  );
}

export function MenuItem({ icon, children, danger = false, ...props }) {
  return (
    <Item $danger={danger} role="none">
      <button type="button" role="menuitem" {...props}>
        {icon}
        {children}
      </button>
    </Item>
  );
}
