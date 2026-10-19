"use client";

import { useState } from "react";

/* Write|Preview switch (spec §6). Markdown only renders on first Preview
   activation — the plan's dynamic-import decision keeps marked (~30KB gz)
   off the initial route unless it's actually needed. One-line loading
   state per plan; body state lives in the parent so toggling both ways
   never loses the draft. */

const PANEL_STYLES =
  "[&_h1]:mt-6 [&_h1]:mb-4 [&_h1]:pb-2 [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:border-b [&_h1]:border-line [&_h2]:mt-6 [&_h2]:mb-4 [&_h2]:pb-1.5 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:border-b [&_h2]:border-line-muted [&_h3]:mt-6 [&_h3]:mb-4 [&_h3]:text-base [&_h3]:font-semibold [&_h3:first-child]:mt-0 [&_p]:mb-4 [&_p]:leading-7 [&_ul]:mb-4 [&_ul]:pl-8 [&_ul]:list-disc [&_ul]:marker:text-faint [&_ol]:mb-4 [&_ol]:pl-8 [&_ol]:list-decimal [&_ol]:marker:text-faint [&_li]:mt-1.5 [&_li]:leading-7 [&_strong]:font-semibold [&_em]:italic [&_blockquote]:pl-4 [&_blockquote]:my-4 [&_blockquote]:text-muted [&_blockquote]:border-l-4 [&_blockquote]:border-line [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[85%] [&_code]:rounded-md [&_code]:bg-inset [&_pre]:p-4 [&_pre]:mb-4 [&_pre]:overflow-x-auto [&_pre]:text-xs [&_pre]:leading-5 [&_pre]:rounded-md [&_pre]:bg-inset [&_hr]:my-6 [&_hr]:border-line [&_a]:text-link [&_a]:hover:underline";

export function WritePreview({
  value,
  onChange,
  disabled,
  errorId,
  textareaId,
}: {
  value: string;
  onChange: (next: string) => void;
  disabled?: boolean;
  errorId?: string;
  textareaId?: string;
}) {
  const [mode, setMode] = useState<"write" | "preview">("write");
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [rendering, setRendering] = useState(false);

  async function activatePreview(): Promise<void> {
    setMode("preview");
    if (previewHtml !== null) return;
    setRendering(true);
    try {
      const { marked } = await import("marked");
      setPreviewHtml(marked.parse(value, { async: false }));
    } catch {
      setPreviewHtml(null);
      setMode("write");
    } finally {
      setRendering(false);
    }
  }

  return (
    <div className="min-w-0 rounded-md border border-line">
      <div
        role="group"
        aria-label="Editor mode"
        className="flex items-center gap-1 border-b border-line bg-subtle px-2 py-1.5"
      >
        <ModeButton
          isActive={mode === "write"}
          onClick={() => setMode("write")}
        >
          Write
        </ModeButton>
        <ModeButton
          isActive={mode === "preview"}
          onClick={() => void activatePreview()}
        >
          Preview
        </ModeButton>
      </div>

      {mode === "write" ? (
        <textarea
          id={textareaId}
          name="body"
          required
          aria-required
          aria-invalid={errorId ? true : undefined}
          aria-describedby={errorId}
          value={value}
          onChange={(event) => {
            onChange(event.target.value);
            // Edits invalidate the cached preview; re-render on demand.
            setPreviewHtml(null);
          }}
          disabled={disabled}
          rows={12}
          placeholder="Markdown supported — headings, lists, code fences."
          className="block min-h-[280px] w-full resize-y rounded-b-md border-0 bg-canvas px-3 py-2 font-mono text-sm leading-6 text-ink outline-none placeholder:text-faint focus:ring-1 focus:ring-inset focus:ring-link"
        />
      ) : (
        <>
          {/* The textarea is unmounted while previewing; keep the draft in
              the submission so "Submit" works from either mode. */}
          <input type="hidden" name="body" value={value} />
          <div
            role="region"
            aria-label="Markdown preview"
            aria-busy={rendering}
            className={`min-h-[280px] px-3 py-2 text-sm ${PANEL_STYLES}`}
          >
            {rendering || previewHtml === null ? (
              <p className="text-muted">Loading preview&#8230;</p>
            ) : previewHtml ? (
              <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
            ) : (
              <p className="text-muted">Nothing to preview.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function ModeButton({
  isActive,
  onClick,
  children,
}: {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={isActive}
      onClick={onClick}
      className={`cursor-pointer rounded-md px-2.5 py-1 text-sm transition-colors duration-150 ${
        isActive
          ? "border border-line bg-canvas text-ink"
          : "border border-transparent text-muted hover:bg-hover"
      }`}
    >
      {children}
    </button>
  );
}
