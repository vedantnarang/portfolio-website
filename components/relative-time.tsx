/* Deterministic ISO → relative time, GitHub-style. Computed on the server
   at build time (fully static output), so there is no hydration mismatch
   surface (PLAN risk table: relative-time hydration). */

function plural(n: number, unit: string): string {
  return `${n} ${unit}${n === 1 ? "" : "s"} ago`;
}

export function formatRelativeTime(iso: string, now = new Date()): string {
  const then = new Date(iso).getTime();
  const diffSeconds = Math.round((now.getTime() - then) / 1000);

  // Clamp future timestamps (clock skew, stale data) — never render "in …".
  if (diffSeconds < 60) return "just now";

  const minutes = Math.floor(diffSeconds / 60);
  if (minutes < 60) return plural(minutes, "minute");

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return plural(hours, "hour");

  const days = Math.floor(hours / 24);
  if (days < 30) return plural(days, "day");

  const months = Math.floor(days / 30.44);
  if (months < 12) return plural(months, "month");

  const years = Math.floor(days / 365.25);
  return plural(years, "year");
}

export function RelativeTime({
  date,
  className,
}: {
  date: string;
  className?: string;
}) {
  const parsed = new Date(date).getTime();
  if (!date || Number.isNaN(parsed)) return null;
  return (
    <time dateTime={date} className={className}>
      {formatRelativeTime(date)}
    </time>
  );
}
