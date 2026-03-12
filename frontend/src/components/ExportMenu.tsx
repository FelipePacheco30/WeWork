import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/Button";

interface ExportMenuProps {
  onExportCsv: () => void;
  onExportPdf: () => void;
}

export function ExportMenu({ onExportCsv, onExportPdf }: ExportMenuProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    window.addEventListener("mousedown", handleOutsideClick);
    return () => window.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div className="relative" ref={wrapperRef}>
      <Button variant="secondary" onClick={() => setOpen((prev) => !prev)}>
        Exportar
      </Button>
      {open ? (
        <div className="absolute right-0 top-12 z-20 min-w-48 border border-white/15 bg-slate-900 p-1 shadow-2xl">
          <button
            className="w-full px-3 py-2 text-left text-sm text-slate-200 transition hover:bg-white/10"
            onClick={() => {
              onExportCsv();
              setOpen(false);
            }}
          >
            Exportar CSV
          </button>
          <button
            className="w-full px-3 py-2 text-left text-sm text-slate-200 transition hover:bg-white/10"
            onClick={() => {
              onExportPdf();
              setOpen(false);
            }}
          >
            Exportar PDF
          </button>
        </div>
      ) : null}
    </div>
  );
}
