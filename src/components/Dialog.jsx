import { useEffect, useRef } from 'react';

/**
 * Wrapper around the native <dialog> element, which gives us the modal
 * backdrop, focus trapping and Escape-to-close for free.
 */
export default function Dialog({ open, onClose, labelledBy, children }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  // `close` also fires for Escape and the backdrop, so the parent state stays
  // in step with the element however it was dismissed.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handle = () => onClose();
    el.addEventListener('close', handle);
    return () => el.removeEventListener('close', handle);
  }, [onClose]);

  return (
    <dialog ref={ref} aria-labelledby={labelledBy}>
      <button className="close" aria-label="Close" onClick={onClose}>
        ×
      </button>
      {children}
    </dialog>
  );
}
