import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { IssueListRow } from "@/components/issues/list-row";
import { IssueOpenedIcon } from "@/components/icons";
import { getIssues } from "@/lib/content";

export const metadata: Metadata = {
  title: "Issues",
  description:
    "Public backlog with honest priorities — plus the pinned issue on the roles I'm open to.",
};

/* Spec §5 — pinned roles issue first, then roadmap issues newest-first.
   Fully static. */
export default async function IssuesPage() {
  const issues = await getIssues();

  return (
    <PageShell>
      <main className="py-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h1 className="text-xl font-semibold">Issues</h1>
          <Link
            href="/issues/new"
            className="inline-flex items-center rounded-md bg-btn-primary px-3 py-1.5 text-sm font-semibold text-white transition-[filter] duration-200 hover:brightness-110"
          >
            New issue
          </Link>
        </div>

        <div className="overflow-hidden rounded-md border border-line">
          <div className="border-b border-line-muted bg-subtle px-4 py-2.5">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <IssueOpenedIcon />
              {issues.length} Open
            </p>
          </div>
          <ul className="divide-y divide-line-muted">
            {issues.map((issue) => (
              <IssueListRow key={issue.id} issue={issue} />
            ))}
          </ul>
        </div>
      </main>
    </PageShell>
  );
}
