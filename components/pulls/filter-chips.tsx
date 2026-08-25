"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

/* Filter chips (spec §3): sync ?label= to the URL. Client component so the
   active chip renders without a server round-trip; navigation itself is a
   prefetched <Link>, which PLAN's risk table deems acceptable. */
const CHIPS = ["backend", "frontend", "data", "ai", "infra"] as const;

export function FilterChips() {
  const params = useSearchParams();
  const active = params.get("label");

  return (
    <nav aria-label="Filter by label" className="flex gap-2 overflow-x-auto">
      <Chip href="/pulls" isActive={active === null}>
        All
      </Chip>
      {CHIPS.map((chip) => (
        <Chip
          key={chip}
          href={`/pulls?label=${chip}`}
          isActive={active === chip}
        >
          {chip}
        </Chip>
      ))}
    </nav>
  );
}

function Chip({
  href,
  isActive,
  children,
}: {
  href: string;
  isActive: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-pressed={isActive}
      className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium transition-colors duration-200 ${
        isActive
          ? "border-accent-emphasis bg-accent-emphasis text-white"
          : "border-line bg-subtle text-muted hover:bg-hover"
      }`}
    >
      {children}
    </Link>
  );
}
