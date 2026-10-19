"use client";

import { CopyButton } from "@/components/copy-button";

/* Copies the exact raw markdown source of CONTRIBUTING.md (PLAN acceptance:
   "Copy copies exact content"). Client island shares the useCopy hook with
   the commit-hash control — one clipboard implementation site-wide. */
export function CopySourceButton({ raw }: { raw: string }) {
  return (
    <CopyButton
      text={raw}
      title="Copy file contents"
      announcement="File contents copied to clipboard"
      className="border border-line bg-subtle px-2 py-1 text-xs font-medium text-muted hover:bg-hover hover:text-link focus-visible:text-link"
    >
      Copy
    </CopyButton>
  );
}
