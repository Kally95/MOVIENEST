import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import "./Modal.css";

export default function Modal({ children, isOpen, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || !isOpen) return;

    if (!dialog.open) {
      dialog.showModal();
    }

    return () => {
      if (dialog.open) {
        dialog.close();
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <dialog
      className="modal"
      ref={ref}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) {
          onClose();
        }
      }}
    >
      {children}
    </dialog>,
    document.getElementById("portal"),
  );
}
