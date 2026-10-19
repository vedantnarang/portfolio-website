"use client";

import { CopyButton } from "@/components/copy-button";

/* Clipboard island (PLAN Phase 3 §7.3): clicking the hash copies it via the
   shared CopyButton primitive. The hash text keeps `select-all` so
   clipboard-blocked environments can still copy manually — no JS needed as
   fallback; the aria-live announcement comes from the primitive. */
export function CopyHashButton({ hash }: { hash: string }) {
  return (
    <CopyButton
      text={hash}
      title="Copy commit hash"
      announcement="Commit hash copied to clipboard"
      className="max-w-full min-w-0 font-mono text-xs text-muted hover:text-link focus-visible:text-link"
      iconClassName="opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
    >
      <span className="select-all">{hash}</span>
    </CopyButton>
  );
}
