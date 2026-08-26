"use client";

import { useState } from "react";
import { DownloadIcon, FileIcon } from "@/components/icons";

/* Client island (PLAN Phase 3 §7.1): native <object> inline preview with an
   always-present Download button beside the toggle — iOS preview quirks
   degrade to the message inside <object>, never a dead end. The download
   attribute gives recruiters one clean filename regardless of the on-disk
   dated name. Expansion is user-initiated inside a fixed-height frame. */
export function PdfInlineViewer({
  src,
  filename,
  sizeKb,
}: {
  src: string;
  filename: string;
  sizeKb?: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-4">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-line-muted pt-3">
        <span className="inline-flex min-w-0 items-center gap-1.5 text-sm text-muted">
          <FileIcon />
          <span className="truncate font-mono text-xs">{filename}</span>
        </span>
        {typeof sizeKb === "number" ? (
          <span className="text-xs text-faint">{sizeKb} KB</span>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <a
          href={src}
          download={filename}
          className="inline-flex items-center gap-1.5 rounded-md border border-line bg-subtle px-3 py-1.5 text-sm font-medium transition-colors duration-200 hover:bg-hover"
        >
          <DownloadIcon />
          Download PDF
        </a>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="pdf-inline-view"
          className="inline-flex items-center gap-1.5 rounded-md border border-line bg-subtle px-3 py-1.5 text-sm font-medium transition-colors duration-200 hover:bg-hover"
        >
          {open ? "Hide preview" : "View inline"}
        </button>
      </div>

      {open ? (
        <div
          id="pdf-inline-view"
          className="mt-3 h-[720px] max-h-[85vh] overflow-hidden rounded-md border border-line bg-inset"
        >
          <object
            data={src}
            type="application/pdf"
            width="100%"
            height="100%"
            aria-label={`Inline preview of ${filename}`}
          >
            <div className="flex h-full items-center justify-center p-6 text-center text-sm text-muted">
              Inline preview isn&apos;t available in this browser — use
              &ldquo;Download PDF&rdquo; instead.
            </div>
          </object>
        </div>
      ) : null}
    </div>
  );
}
