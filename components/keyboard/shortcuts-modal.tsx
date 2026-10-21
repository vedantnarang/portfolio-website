"use client";

import { useEffect, useRef } from "react";
import { SHORTCUTS, type Shortcut } from "@/components/keyboard/shortcuts";

/* The `?` modal. A native <dialog> opened with showModal(): the browser
   makes the rest of the page inert (focus can't escape), closes it on
   Esc, and returns focus to where it was — no hand-rolled focus trap.
   Full-screen sheet below 480px. */
export function ShortcutsModal({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    // Guard: StrictMode runs this twice in development.
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  const groups = Object.entries(
    SHORTCUTS.reduce<Record<string, Shortcut[]>>((acc, s) => {
      (acc[s.group] ??= []).push(s);
      return acc;
    }, {}),
  );

  return (
    <dialog
      ref={ref}
      aria-labelledby="shortcuts-title"
      onClose={onClose}
      onClick={(e) => {
        // Clicks on the backdrop land on the <dialog> element itself.
        if (e.target === e.currentTarget) e.currentTarget.close();
      }}
      className="m-auto w-full max-w-md rounded-md border border-line bg-overlay p-0 text-ink shadow-xl backdrop:bg-black/50 max-[479px]:h-full max-[479px]:max-h-none max-[479px]:max-w-none max-[479px]:rounded-none"
    >
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <h2 id="shortcuts-title" className="text-base font-semibold">
          Keyboard shortcuts
        </h2>
        <button
          type="button"
          autoFocus
          onClick={() => ref.current?.close()}
          className="cursor-pointer rounded-md px-2 py-1 text-sm text-muted transition-colors duration-150 hover:bg-hover hover:text-ink"
        >
          Close
        </button>
      </div>

      <div className="space-y-5 px-4 py-4">
        {groups.map(([group, shortcuts]) => (
          <section key={group}>
            <h3 className="mb-2 text-xs font-semibold text-muted">{group}</h3>
            <dl className="divide-y divide-line-muted rounded-md border border-line-muted">
              {shortcuts.map((s) => (
                <div key={s.action} className="flex items-center justify-between gap-4 px-3 py-2 text-sm">
                  <dt>{s.description}</dt>
                  <dd className="flex shrink-0 items-center gap-1">
                    {s.keys.map((key, i) => (
                      <span key={key} className="flex items-center gap-1">
                        {i > 0 && <span className="text-xs text-muted">then</span>}
                        <kbd className="min-w-6 rounded-md border border-line bg-subtle px-1.5 py-0.5 text-center font-mono text-xs shadow-[inset_0_-1px_0_var(--line)]">
                          {key}
                        </kbd>
                      </span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </dialog>
  );
}
