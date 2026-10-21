"use client";

import { useEffect, useState } from "react";
import { CheckIcon, CopyIcon } from "@/components/icons";

type Status = "idle" | "copied" | "failed";

/* The site's only clipboard island (PLAN Phase 3 §7.3) — commit hashes
   and the CONTRIBUTING blob viewer both use it. The text being copied
   always stays selectable next to the button, so a blocked Clipboard API
   degrades to manual copy rather than a dead control. */
export function CopyButton({
  text,
  label,
  showText = false,
}: {
  text: string;
  label: string;
  /** Render a visible "Copy"/"Copied!" caption beside the icon. */
  showText?: boolean;
}) {
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    if (status === "idle") return;
    const t = setTimeout(() => setStatus("idle"), 2000);
    return () => clearTimeout(t);
  }, [status]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  }

  const caption =
    status === "copied" ? "Copied!" : status === "failed" ? "Copy failed" : "Copy";

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={label}
      title={status === "failed" ? "Clipboard blocked — select the text instead" : label}
      className={`inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 text-xs font-medium transition-colors duration-150 hover:bg-hover ${
        status === "copied" ? "text-success" : status === "failed" ? "text-danger" : "text-muted hover:text-ink"
      }`}
    >
      {status === "copied" ? <CheckIcon /> : <CopyIcon />}
      {showText && <span aria-hidden>{caption}</span>}
      <span role="status" className="sr-only">
        {status === "copied" ? "Copied to clipboard" : status === "failed" ? "Copy failed — select the text instead" : ""}
      </span>
    </button>
  );
}
