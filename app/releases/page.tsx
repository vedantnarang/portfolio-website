import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { getReleases } from "@/lib/content";
import { ReleaseCard } from "@/components/releases/release-card";

export const metadata: Metadata = {
  title: "Releases",
  description: "Résumé versions with changelog notes.",
};

/* Fully static (PLAN Phase 3 §7.4). Newest first; exactly one latest:true
   enforced at the data layer (lib/content getReleases guards). */
export default function ReleasesPage() {
  const releases = getReleases();

  return (
    <PageShell>
      <main className="py-6">
        <h1 className="sr-only">Releases</h1>

        <div className="divide-y divide-line-muted overflow-hidden rounded-md border border-line">
          {releases.map((release) => (
            <ReleaseCard key={release.version} release={release} />
          ))}
        </div>
      </main>
    </PageShell>
  );
}
