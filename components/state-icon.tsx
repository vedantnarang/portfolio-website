import type { PrState } from "@/types/content";

/* State glyphs per design.md §2: open=success circle · merged=done
   circle-with-square · closed=danger cross · draft=neutral dashed.
   Fixed 16px, currentColor-driven. */

function Svg({ children }: { children: React.ReactNode }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      width="16"
      height="16"
      fill="currentColor"
      className="inline-block shrink-0 align-text-bottom"
    >
      {children}
    </svg>
  );
}

export type AnyState = PrState | "closed";

const STATE_COLOR: Record<AnyState, string> = {
  open: "text-success",
  merged: "text-done",
  closed: "text-danger",
  draft: "text-neutral",
};

function Glyph({ state }: { state: AnyState }) {
  switch (state) {
    case "open":
      return (
        <Svg>
          {/* issue-opened */}
          <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
          <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z" />
        </Svg>
      );
    case "merged":
      return (
        <Svg>
          {/* git-merge */}
          <path d="M5.45 5.154A4.25 4.25 0 0 0 9.25 7.5h1.378a2.251 2.251 0 1 1 0 1.5H9.25A5.734 5.734 0 0 1 5 7.123v3.505a2.25 2.25 0 1 1-1.5 0V5.372a2.25 2.25 0 1 1 1.95-.218ZM4.25 13.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm8.5-4.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM5 3.25a.75.75 0 1 0 0 .005V3.25Z" />
        </Svg>
      );
    case "closed":
      return (
        <Svg>
          {/* issue-closed */}
          <path d="M11.28 6.78a.75.75 0 0 0-1.06-1.06L7.25 8.69 5.78 7.22a.75.75 0 0 0-1.06 1.06l2 2a.75.75 0 0 0 1.06 0l3.5-3.56Z" />
          <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z" />
        </Svg>
      );
    case "draft":
      return (
        <Svg>
          {/* dashed circle reads as draft without a dedicated octicon path */}
          <circle
            cx="8"
            cy="8"
            r="6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeDasharray="2.4 2.2"
          />
        </Svg>
      );
  }
}

export function StateIcon({
  state,
  className = "",
}: {
  state: AnyState;
  className?: string;
}) {
  return (
    <span className={`shrink-0 ${STATE_COLOR[state]} ${className}`}>
      <Glyph state={state} />
    </span>
  );
}
