import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { IssueList } from "@/components/issues/issue-list";

export const metadata: Metadata = {
  title: "Issues",
  description:
    "Public backlog with honest priorities — plus the pinned issue on the roles I'm open to.",
};

/* Spec §5 — pinned roles issue first, then roadmap issues newest-first.
   Fully static. */
export default function IssuesPage() {
  return (
    <PageShell>
      <main className="py-6">
        <IssueList state="open" />
      </main>
    </PageShell>
  );
}
