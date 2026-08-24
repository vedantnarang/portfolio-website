import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { EmptyState } from "@/components/empty-state";
import { IssueOpenedIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Issues",
  description: "Backlog and what I'm looking for.",
};

export default function IssuesPage() {
  return (
    <PageShell>
      <main className="py-6">
        <h1 className="sr-only">Issues</h1>
        <EmptyState
          icon={<IssueOpenedIcon />}
          title="No issues yet"
          body="The public backlog — including the pinned roles issue — lands with Phase 3 of the build."
        />
      </main>
    </PageShell>
  );
}
