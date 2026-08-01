import { useEffect, useRef } from "react";

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

/**
 * Keyboard behaviour for the two navigation drawers.
 *
 * Both of them announce themselves with `aria-modal="true"`, which tells a
 * screen reader that the rest of the page is inert. Nothing was enforcing that:
 * Tab walked straight out into the page behind, Escape did nothing, and closing
 * the drawer dropped focus back to the top of the document. Returns a ref to
 * put on the drawer element.
 *
 * The dashboard's <Modal> already does this for itself; this is the same
 * contract for the two drawers that are not modals in the React sense.
 */
export default function useFocusTrap(isOpen, onDismiss) {
  const containerRef = useRef(null);
  // Callers pass an inline arrow, so keep the latest one without letting its
  // identity restart the effect and yank focus back to the first item.
  const dismissRef = useRef(onDismiss);
  dismissRef.current = onDismiss;

  useEffect(() => {
    const container = containerRef.current;
    if (!isOpen || !container) return undefined;

    const opener = document.activeElement;
    const focusable = () =>
      Array.from(container.querySelectorAll(FOCUSABLE)).filter(
        (element) => element.getClientRects().length > 0
      );

    focusable()[0]?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        dismissRef.current?.();
        return;
      }
      if (event.key !== "Tab") return;

      const items = focusable();
      if (!items.length) return;

      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown, true);

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      if (opener instanceof HTMLElement) opener.focus();
    };
  }, [isOpen]);

  return containerRef;
}
