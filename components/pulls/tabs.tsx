"use client";

import { useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

/* PR detail tabs — URL-synced via route params (/pull/4/files), so deep
   links and back-button work without extra state. Roving tabindex +
   arrow keys per the WAI-ARIA tabs pattern; ~1KB hydrated. */
const TABS = [
  { key: "conversation", label: "Conversation" },
  { key: "architecture", label: "Architecture" },
  { key: "checks", label: "Checks" },
  { key: "files", label: "Files changed" },
] as const;

export type PrTabKey = (typeof TABS)[number]["key"];

export function PrTabs({
  prId,
  active,
}: {
  prId: number;
  active: PrTabKey;
}) {
  const router = useRouter();
  const tabRefs = useRef<Array<HTMLAnchorElement | null>>([]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    const idx = TABS.findIndex((t) => t.key === active);
    let next: number | null = null;
    if (event.key === "ArrowRight") next = (idx + 1) % TABS.length;
    else if (event.key === "ArrowLeft")
      next = (idx - 1 + TABS.length) % TABS.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = TABS.length - 1;
    if (next !== null) {
      event.preventDefault();
      tabRefs.current[next]?.focus();
      router.push(`/pull/${prId}/${TABS[next].key}`);
    }
  };

  return (
    <div
      role="tablist"
      aria-label="Pull request views"
      onKeyDown={onKeyDown}
      className="-mb-px flex gap-1 overflow-x-auto border-b border-line"
    >
      {TABS.map((tab, i) => {
        const isActive = tab.key === active;
        return (
          <Link
            key={tab.key}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            href={`/pull/${prId}/${tab.key}`}
            role="tab"
            id={`tab-${tab.key}`}
            aria-selected={isActive}
            aria-controls={`panel-${tab.key}`}
            tabIndex={isActive ? 0 : -1}
            scroll={false}
            className={`flex items-center gap-2 whitespace-nowrap rounded-t-md border-b-2 px-3 py-2 text-sm transition-colors duration-200 ${
              isActive
                ? "border-accent-emphasis font-semibold text-ink"
                : "border-transparent text-muted hover:border-line-muted hover:bg-hover"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
