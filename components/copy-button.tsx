"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { CheckIcon, CopyIcon } from "@/components/icons";

/* Shared clipboard logic for the site's tiny client islands (PLAN Phase 3
   §7.3 — no global clipboard service). Visual confirmation is left to the
   consumer; this returns state and wires timers/cleanup. */

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

export function useCopy(text: string, confirmedMs = 1600) {
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
      timer.current = window.setTimeout(() => setCopied(false), confirmedMs);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(done, () => {
        if (fallbackCopy(text)) done();
      });
    } else if (fallbackCopy(text)) {
      done();
    }
  }, [text, confirmedMs]);

  return { copied, copy };
}

/** Generic copy control: custom idle content, trailing status icon that
    swaps to a green check on success, aria-live announcement. */
export function CopyButton({
  text,
  title,
  announcement = "Copied to clipboard",
  className = "",
  iconClassName = "",
  children,
}: {
  text: string;
  title?: string;
  announcement?: string;
  className?: string;
  iconClassName?: string;
  children?: ReactNode;
}) {
  const { copied, copy } = useCopy(text);

  return (
    <button
      type="button"
      onClick={copy}
      title={title}
      className={`group inline-flex items-center gap-1.5 rounded transition-colors duration-150 ${className}`}
    >
      {children}
      <span
        aria-hidden
        className={`${copied ? "text-success" : ""} ${iconClassName}`}
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </span>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? announcement : ""}
      </span>
    </button>
  );
}
