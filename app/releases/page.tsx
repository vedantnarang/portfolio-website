import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { ReleaseCard } from "@/components/releases/release-card";
import { getReleases } from "@/lib/content";

export const metadata: Metadata = {
  title: "Releases",
  description:
    "Résumé versions with changelog notes — download the latest PDF or view it inline.",
};

/* Spec §7 — the résumé's canonical home. Newest first; fully static. */
export default function ReleasesPage() {
  const releases = getReleases();

  return (
    <PageShell>
      <main className="py-6">
        <h1 className="mb-6 text-xl font-semibold">Releases</h1>
        <ol className="space-y-8">
          {releases.map((release) => (
            <ReleaseCard key={release.version} release={release} />
          ))}
        </ol>
      </main>
    </PageShell>
  );
}
