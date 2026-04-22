import { useEffect, useRef } from "react";

export default function Modal({ onClose, children }) {
  const overlayRef = useRef(null);

  // Escape key + body scroll lock
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  // Push the sheet up when the soft keyboard appears
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    function onViewportChange() {
      const overlay = overlayRef.current;
      if (!overlay) return;
      // Keyboard height = layout viewport height minus visual viewport height
      const keyboardHeight = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      overlay.style.paddingBottom = `${keyboardHeight}px`;
    }

    vv.addEventListener("resize", onViewportChange);
    vv.addEventListener("scroll", onViewportChange);
    onViewportChange();

    return () => {
      vv.removeEventListener("resize", onViewportChange);
      vv.removeEventListener("scroll", onViewportChange);
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      className="modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-sheet" role="dialog" aria-modal="true">
        <div className="modal-handle" />
        {children}
      </div>
    </div>
  );
}
