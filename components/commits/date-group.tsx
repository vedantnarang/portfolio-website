import type { CareerCommit } from "@/types/content";
import { CommitRow } from "@/components/commits/commit-row";
import { GitCommitIcon } from "@/components/icons";

const MONTH_FMT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

/** Group newest-first commits by calendar month, preserving order. */
export function groupByMonth(
  commits: CareerCommit[],
): Array<{ key: string; label: string; commits: CareerCommit[] }> {
  const groups = new Map<string, { key: string; label: string; commits: CareerCommit[] }>();
  for (const commit of commits) {
    const key = commit.date.slice(0, 7);
    const group = groups.get(key) ?? {
      key,
      label: MONTH_FMT.format(new Date(commit.date)),
      commits: [],
    };
    group.commits.push(commit);
    groups.set(key, group);
  }
  return [...groups.values()];
}

/* Month header + its commits, hung off the timeline rail drawn by the
   page. Not sticky: with ~one commit per month a sticky header buys
   nothing, and it would fight Phase 5's pinned scrub on this section. */
export function DateGroup({ label, commits }: { label: string; commits: CareerCommit[] }) {
  return (
    <li className="relative pb-6 pl-8 last:pb-0">
      <h2 className="mb-2 flex items-center gap-2 text-sm text-muted">
        <span className="absolute left-0 flex h-5 w-4 items-center justify-center bg-canvas text-muted">
          <GitCommitIcon />
        </span>
        Commits on {label}
      </h2>
      <ol className="divide-y divide-line-muted overflow-hidden rounded-md border border-line">
        {commits.map((commit) => (
          <CommitRow key={commit.hash} commit={commit} />
        ))}
      </ol>
    </li>
  );
}
