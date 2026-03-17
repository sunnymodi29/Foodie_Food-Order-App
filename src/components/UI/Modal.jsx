"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const Modal = ({ children, open, onClose, className = "" }) => {
  const [mounted, setMounted] = useState(false);
  const dialog = useRef();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const modal = dialog.current;

    if (open) {
      modal.showModal();
    } else {
      modal.close();
    }

    // No need for return () => modal.close() here if we handle it in else
  }, [open, mounted]);

  if (!mounted) return null;

  return createPortal(
    <dialog ref={dialog} className={`modal ${className}`} onClose={onClose}>
      {children}
    </dialog>,
    document.getElementById("modal")
  );
};

export default Modal;
