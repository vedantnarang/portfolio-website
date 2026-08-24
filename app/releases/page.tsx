import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { EmptyState } from "@/components/empty-state";
import { TagIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Releases",
  description: "Résumé versions with changelog notes.",
};

export default function ReleasesPage() {
  return (
    <PageShell>
      <main className="py-6">
        <h1 className="sr-only">Releases</h1>
        <EmptyState
          icon={<TagIcon />}
          title="No releases yet"
          body="Résumé releases land with Phase 3 of the build."
        />
      </main>
    </PageShell>
  );
}
