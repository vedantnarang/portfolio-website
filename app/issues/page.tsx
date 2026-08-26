import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { getIssues } from "@/lib/content";
import { IssueListRow } from "@/components/issues/list-row";
import { IssueOpenedIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Issues",
  description: "Backlog and what I'm looking for.",
};

/* Fully static (PLAN Phase 3 §7.4) — no filter searchParams here,
   unlike /pulls. Pinned-first ordering comes from getIssues(). */
export default async function IssuesPage() {
  const all = await getIssues();

  return (
    <PageShell>
      <main className="py-6">
        <h1 className="sr-only">Issues</h1>

        <div className="overflow-hidden rounded-md border border-line">
          <div className="flex items-center justify-between border-b border-line-muted bg-subtle px-4 py-2.5">
            <p className="flex items-center gap-2 text-sm font-medium text-muted">
              <IssueOpenedIcon />
              {all.length} open
            </p>
          </div>

          <ul className="divide-y divide-line-muted">
            {all.map((issue) => (
              <IssueListRow key={issue.id} issue={issue} />
            ))}
          </ul>
        </div>
      </main>
    </PageShell>
  );
}
