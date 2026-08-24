import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { EmptyState } from "@/components/empty-state";
import { GitCommitIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Commits",
  description: "Career timeline as a commit history.",
};

export default function CommitsPage() {
  return (
    <PageShell>
      <main className="py-6">
        <h1 className="sr-only">Commits</h1>
        <EmptyState
          icon={<GitCommitIcon />}
          title="No commits yet"
          body="The career timeline lands with Phase 3 of the build."
        />
      </main>
    </PageShell>
  );
}
