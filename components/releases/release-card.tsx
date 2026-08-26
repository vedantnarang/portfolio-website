import type { Release } from "@/types/content";
import { TagIcon } from "@/components/icons";
import { RelativeTime } from "@/components/relative-time";
import { PdfInlineViewer } from "@/components/releases/pdf-viewer";
import { site } from "@/data/site";

/* GitHub release card (spec §7): tag version + Latest pill, relative date,
   changelog bullets, and — only where the binary is archived — the PDF
   asset row with Download / View-inline controls. Historical tags render
   notes only rather than pointing at a file their changelog doesn't match. */

/** Our release notes are controlled data: uniform "- " bullet lists.
    Renders them as GitHub-style list markup without pulling in a parser. */
function NotesList({ markdown }: { markdown: string }) {
  const items = markdown
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^- /, ""));
  return (
    <ul className="list-disc pl-8 marker:text-faint">
      {items.map((item, i) => (
        <li key={i} className="mt-1.5 leading-7 first:mt-0">
          {item}
        </li>
      ))}
    </ul>
  );
}

export function ReleaseCard({ release }: { release: Release }) {
  return (
    <section className="p-4 sm:p-6">
      <h2 className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-lg font-semibold leading-tight">
        <span className="text-muted">
          <TagIcon />
        </span>
        <span className="font-mono">{release.version}</span>
        {release.latest ? (
          <span className="rounded-full bg-success-tint px-2 py-0.5 text-xs font-medium leading-4 text-success">
            Latest
          </span>
        ) : null}
      </h2>

      <p className="mt-1.5 text-sm text-muted">
        Released{" "}
        <RelativeTime date={release.releasedAt} className="whitespace-nowrap" />{" "}
        <span aria-hidden>·</span> {site.owner}
      </p>

      <div className="mt-4 border-t border-line-muted pt-4">
        <NotesList markdown={release.notes} />
      </div>

      {release.pdfPath ? (
        <PdfInlineViewer
          src={release.pdfPath}
          filename="vedant-narang-resume.pdf"
          sizeKb={release.sizeKb}
        />
      ) : null}
    </section>
  );
}
