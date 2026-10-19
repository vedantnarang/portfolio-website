import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { getContributing } from "@/lib/content";
import { BlobViewer } from "@/components/blob/blob-viewer";

export const metadata: Metadata = {
  title: "CONTRIBUTING.md",
  description: "How I work — review style, strengths, honest gaps.",
};

/* Literal route segment per spec §1 (/blob/main/CONTRIBUTING.md).
   Directory name carries the dot; Next treats it as a plain URL segment. */
export default async function ContributingPage() {
  const view = await getContributing();

  return (
    <PageShell>
      <main className="py-6">
        <h1 className="sr-only">CONTRIBUTING.md</h1>
        <BlobViewer view={view} />
      </main>
    </PageShell>
  );
}
