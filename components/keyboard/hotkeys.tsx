"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { GO_TO } from "@/components/keyboard/shortcuts";

/* Loaded on the first `?` only — the listener itself stays tiny, so every
   route can afford it from the root layout. */
const ShortcutsModal = dynamic(
  () => import("@/components/keyboard/shortcuts-modal").then((m) => m.ShortcutsModal),
  { ssr: false },
);

/** How long the second key of a `g` chord is waited for. */
const CHORD_MS = 1000;

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  );
}

/** j/k: move focus to the next/previous list row's link. Enter then opens
   it natively — no custom "open" logic to get wrong. */
function moveRow(delta: 1 | -1): boolean {
  const rows = Array.from(document.querySelectorAll<HTMLElement>("[data-hotkey-row]")).filter(
    (row) => row.offsetParent !== null,
  );
  if (rows.length === 0) return false;
  const current = rows.findIndex((row) => row.contains(document.activeElement));
  const next =
    current === -1
      ? delta === 1
        ? 0
        : rows.length - 1
      : Math.min(rows.length - 1, Math.max(0, current + delta));
  const link = rows[next].querySelector<HTMLElement>("a[href]");
  if (!link) return false;
  link.focus();
  link.scrollIntoView({ block: "nearest" });
  return true;
}

export function HotkeyListener() {
  const router = useRouter();
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    let chordStartedAt = 0;

    function onKeyDown(e: KeyboardEvent) {
      if (e.defaultPrevented || e.isComposing || e.ctrlKey || e.metaKey || e.altKey) return;
      if (isTypingTarget(e.target)) return;
      // A modal owns the keyboard while it's open (Esc is handled natively).
      if (document.querySelector("dialog[open]")) return;

      if (chordStartedAt && Date.now() - chordStartedAt < CHORD_MS) {
        chordStartedAt = 0;
        const href = GO_TO[e.key];
        if (href) {
          e.preventDefault();
          router.push(href);
        }
        return;
      }
      chordStartedAt = 0;

      switch (e.key) {
        case "g":
          chordStartedAt = Date.now();
          return;
        case "j":
        case "k":
          if (moveRow(e.key === "j" ? 1 : -1)) e.preventDefault();
          return;
        case "?":
          e.preventDefault();
          setHelpOpen(true);
          return;
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [router]);

  return helpOpen ? <ShortcutsModal onClose={() => setHelpOpen(false)} /> : null;
}
