import { useCallback, useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";

import { IconClose } from "./Icons.jsx";
import styles from "./Modal.module.css";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Accessible dialog: portal-rendered, focus-trapped, Escape-closable,
 * click-outside-closable, scroll-locked, and it hands focus back on close.
 */
export function Modal({ open, onClose, labelledBy, variant = "default", dismissible = true, children }) {
  const cardRef = useRef(null);
  const restoreFocusRef = useRef(null);
  const generatedId = useId();
  const titleId = labelledBy ?? generatedId;

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Escape" && dismissible) {
        event.stopPropagation();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = cardRef.current?.querySelectorAll(FOCUSABLE);
      if (!focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || active === cardRef.current)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [dismissible, onClose],
  );

  useEffect(() => {
    if (!open) return;

    restoreFocusRef.current = document.activeElement;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const focusTarget = cardRef.current?.querySelector("[data-autofocus]") ?? cardRef.current;
    focusTarget?.focus({ preventScroll: true });

    return () => {
      document.body.style.overflow = overflow;
      restoreFocusRef.current?.focus?.({ preventScroll: true });
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className={styles.backdrop} onMouseDown={(event) => event.target === event.currentTarget && dismissible && onClose()}>
      <div
        ref={cardRef}
        id={titleId}
        className={`${styles.card} ${styles[variant] ?? ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
      >
        {dismissible && (
          <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
            <IconClose />
          </button>
        )}
        {children}
      </div>
    </div>,
    document.body,
  );
}