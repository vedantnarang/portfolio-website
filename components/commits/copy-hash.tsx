"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CheckIcon, CopyIcon } from "@/components/icons";

/* Clipboard island (PLAN Phase 3 §7.3): clicking the hash copies it.
   Confirmation is visual (glyph swap → green check) plus an aria-live
   announcement. The hash text keeps `select-all` so clipboard-blocked
   environments can still copy manually — no JS required as fallback. */

function fallbackCopy(text: string): boolean {
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

export function CopyHashButton({ hash }: { hash: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    },
    [],
  );

  const copy = useCallback(() => {
    const done = () => {
      setCopied(true);
      if (timer.current !== null) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1600);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(hash).then(done, () => {
        if (fallbackCopy(hash)) done();
      });
    } else if (fallbackCopy(hash)) {
      done();
    }
  }, [hash]);

  return (
    <button
      type="button"
      onClick={copy}
      title="Copy commit hash"
      className="group inline-flex max-w-full min-w-0 items-center gap-1 rounded font-mono text-xs text-muted transition-colors hover:text-link focus-visible:text-link"
    >
      <span className="select-all">{hash}</span>
      <span
        aria-hidden
        className={
          copied
            ? "text-success"
            : "opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
        }
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </span>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? "Commit hash copied to clipboard" : ""}
      </span>
    </button>
  );
}
