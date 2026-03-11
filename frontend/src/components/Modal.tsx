import { useEffect, useId, useRef } from "react";
import type { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ open, title, onClose, children }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const headingId = useId();

  useEffect(() => {
    if (!open || !dialogRef.current) return;
    dialogRef.current.focus();
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        tabIndex={-1}
        className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-2xl bg-white p-5 shadow-2xl outline-none md:p-6"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <h2 id={headingId} className="mb-4 text-lg font-semibold text-slate-800">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}
