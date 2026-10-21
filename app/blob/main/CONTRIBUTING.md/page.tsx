import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { Prose } from "@/components/prose";
import { BlobViewer } from "@/components/blob/blob-viewer";
import { getContributing } from "@/lib/content";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "CONTRIBUTING.md",
  description:
    "How I work with a team — code review, strengths, honest weaknesses, and what makes me productive.",
};

/* Spec §8 — literal route segment mirroring GitHub's blob URL. */
export default async function ContributingPage() {
  const { raw, content, lineCount } = await getContributing();
  const Body = content.Component;

  return (
    <PageShell>
      <main className="py-6">
        <h1 className="mb-4 flex flex-wrap items-center gap-1 text-base">
          <Link href="/" className="font-semibold text-link hover:underline">
            {site.repo}
          </Link>
          <span className="text-muted">/</span>
          <span className="font-semibold">CONTRIBUTING.md</span>
        </h1>
        <BlobViewer
          fileName="CONTRIBUTING.md"
          raw={raw}
          lineCount={lineCount}
          rawHref="/raw/main/CONTRIBUTING.md"
        >
          <Prose>
            <Body />
          </Prose>
        </BlobViewer>
      </main>
    </PageShell>
  );
}
