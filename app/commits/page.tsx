import type { Metadata } from "next";
import type { CareerCommit } from "@/types/content";
import { PageShell } from "@/components/page-shell";
import { getCommits } from "@/lib/content";
import { CommitRow } from "@/components/commits/commit-row";
import { DateGroupHeader } from "@/components/commits/date-group";

export const metadata: Metadata = {
  title: "Commits",
  description: "Career history, presented as a commit timeline.",
};

/* Month labels formatted in UTC so a date-only ISO string ("2026-03-02")
   never slips into the previous month on non-UTC build machines. */
const MONTH_FMT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

interface MonthGroup {
  key: string;
  label: string;
  commits: CareerCommit[];
}

function groupByMonth(commits: CareerCommit[]): MonthGroup[] {
  const groups = new Map<string, MonthGroup>();
  for (const c of commits) {
    const key = c.date.slice(0, 7);
    let g = groups.get(key);
    if (!g) {
      g = {
        key,
        label: MONTH_FMT.format(new Date(`${key}-01T00:00:00Z`)),
        commits: [],
      };
      groups.set(key, g);
    }
    g.commits.push(c);
  }
  return [...groups.values()];
}

export default function CommitsPage() {
  // getCommits() returns newest-first; grouping preserves that order.
  const groups = groupByMonth(getCommits());

  return (
    <PageShell>
      <main className="py-6">
        <h1 className="sr-only">Commits</h1>

        <div className="overflow-hidden rounded-md border border-line">
          {groups.map((g, i) => (
            <section key={g.key} className={i > 0 ? "border-t border-line-muted" : undefined}>
              <DateGroupHeader label={g.label} />
              <ul className="divide-y divide-line-muted">
                {g.commits.map((c) => (
                  <CommitRow key={c.hash} commit={c} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      </main>
    </PageShell>
  );
}
