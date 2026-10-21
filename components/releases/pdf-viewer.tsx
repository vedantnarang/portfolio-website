"use client";

import { useId, useState } from "react";
import { EyeIcon } from "@/components/icons";

/* "View inline" toggle (spec §7). The <object> mounts only on demand, so
   the PDF isn't fetched until asked for. Native PDF rendering + the
   always-present Download link beside it (PLAN Phase 3 §7.1); the
   <object> fallback covers browsers that won't render PDFs inline. */
export function PdfInlineViewer({
  pdfPath,
  title,
  children,
}: {
  pdfPath: string;
  title: string;
  /** Server-rendered actions shown beside the toggle (the Download link). */
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {children}
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((o) => !o)}
          className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-line bg-subtle px-3 py-1.5 text-sm font-medium transition-colors duration-200 hover:bg-hover"
        >
          <EyeIcon />
          {open ? "Hide inline view" : "View inline"}
        </button>
      </div>

      <div id={panelId} hidden={!open} className="mt-3">
        {open && (
          <object
            data={pdfPath}
            type="application/pdf"
            aria-label={title}
            className="block h-[80vh] min-h-[480px] w-full rounded-md border border-line bg-inset"
          >
            <p className="p-6 text-sm text-muted">
              This browser can&#39;t display PDFs inline —{" "}
              <a href={pdfPath} className="text-link hover:underline">
                open the PDF directly
              </a>
              .
            </p>
          </object>
        )}
      </div>
    </div>
  );
}
