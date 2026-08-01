import { useCallback, useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import styled, { keyframes } from "styled-components";
import { HiOutlineXMark } from "react-icons/hi2";

const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const slideUp = keyframes`
  from { opacity: 0; transform: translateY(12px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
  background-color: var(--scrim);
  backdrop-filter: blur(3px);
  display: grid;
  place-items: center;
  padding: var(--space-4);
  overflow-y: auto;
  animation: ${fadeIn} var(--duration) var(--ease);
`;

const Panel = styled.div`
  width: 100%;
  max-width: ${({ $width }) => $width};
  max-height: calc(100dvh - var(--space-8));
  display: flex;
  flex-direction: column;
  background-color: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  animation: ${slideUp} var(--duration) var(--ease);
`;

const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-5) var(--space-5) var(--space-4);
  border-bottom: 1px solid var(--border);
`;

const Title = styled.h2`
  font-size: var(--text-lg);
`;

const Description = styled.p`
  font-size: var(--text-sm);
  color: var(--text-muted);
  margin-top: 0.4rem;
`;

const CloseButton = styled.button`
  display: grid;
  place-items: center;
  width: 3.4rem;
  height: 3.4rem;
  flex-shrink: 0;
  border-radius: var(--radius-sm);
  color: var(--text-muted);
  transition: background-color var(--duration) var(--ease);

  &:hover {
    background-color: var(--surface-hover);
    color: var(--text);
  }
  & svg {
    width: 2rem;
    height: 2rem;
  }
`;

const Body = styled.div`
  padding: var(--space-5);
  overflow-y: auto;
`;

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Accessible dialog.
 *
 * The previous modal was a plain div: no escape key, no focus trap, no return
 * focus, and clicking anywhere inside a child that stopped propagation left it
 * stuck open. This one traps Tab, restores focus to whatever opened it, locks
 * body scroll, and is labelled for screen readers.
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  width = "56rem",
  children,
}) {
  const panelRef = useRef(null);
  const openerRef = useRef(null);
  const titleId = useId();
  const descriptionId = useId();

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = panelRef.current?.querySelectorAll(FOCUSABLE);
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return undefined;

    openerRef.current = document.activeElement;

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    // Defer so the panel is mounted before we look for something to focus.
    const frame = requestAnimationFrame(() => {
      const target = panelRef.current?.querySelector(FOCUSABLE);
      (target ?? panelRef.current)?.focus();
    });

    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = overflow;
      openerRef.current?.focus?.();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <Overlay
      onMouseDown={(event) => {
        // mousedown, not click: a drag that ends on the overlay should not
        // close a dialog the user was selecting text in.
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <Panel
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        $width={width}
      >
        {(title || description) && (
          <Header>
            <div>
              {title && <Title id={titleId}>{title}</Title>}
              {description && (
                <Description id={descriptionId}>{description}</Description>
              )}
            </div>
            <CloseButton type="button" onClick={onClose} aria-label="Close dialog">
              <HiOutlineXMark />
            </CloseButton>
          </Header>
        )}
        <Body>{children}</Body>
      </Panel>
    </Overlay>,
    document.body
  );
}
