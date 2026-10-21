import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { DateGroup, groupByMonth } from "@/components/commits/date-group";
import { BranchIcon } from "@/components/icons";
import { getCommits } from "@/lib/content";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Commits",
  description:
    "Career timeline as a commit history — education, internships and roles, newest first.",
};

/* Spec §4 — career history grouped by month, newest first. Fully static. */
export default function CommitsPage() {
  const groups = groupByMonth(getCommits());

  return (
    <PageShell>
      <main className="py-6">
        <h1 className="mb-4 text-xl font-semibold">Commits</h1>
        <p className="mb-6 flex items-center gap-2 text-sm text-muted">
          <BranchIcon />
          <span className="rounded-md border border-line bg-subtle px-1.5 py-0.5 font-mono text-xs text-ink">
            {site.defaultBranch}
          </span>
        </p>

        <div className="relative">
          {/* Timeline rail. Its own element so Phase 5 can scrub-draw it
              with a transform without touching the rows. */}
          <div
            aria-hidden
            data-timeline-connector
            className="absolute top-2.5 bottom-2 left-[7.5px] w-px origin-top bg-line"
          />
          <ol className="relative">
            {groups.map((group) => (
              <DateGroup key={group.key} label={group.label} commits={group.commits} />
            ))}
          </ol>
        </div>
      </main>
    </PageShell>
  );
}
