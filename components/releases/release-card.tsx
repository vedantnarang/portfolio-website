import { marked } from "marked";
import type { Release } from "@/types/content";
import { PdfInlineViewer } from "@/components/releases/pdf-viewer";
import { DownloadIcon, FileIcon, TagIcon } from "@/components/icons";
import { site } from "@/data/site";

const DATE_FMT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

/* The latest résumé downloads under a stable name so a recruiter's
   Downloads folder doesn't fill with dated variants (handoff §5);
   historical versions keep their version in the name. */
const LATEST_DOWNLOAD_NAME = "vedant-narang-resume.pdf";

/* Notes are authored markdown from data/releases.ts (trusted, ours),
   rendered at build — marked never reaches the client. Element styling
   mirrors mdx-components.tsx. */
const NOTES_CLASS = [
  "text-sm leading-6 text-ink",
  "[&_h2]:mt-4 [&_h2]:mb-2 [&_h2]:text-base [&_h2]:font-semibold [&_h2:first-child]:mt-0",
  "[&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mt-1 [&_li]:marker:text-faint",
  "[&_p]:mb-3 [&_p:last-child]:mb-0",
  "[&_code]:rounded-md [&_code]:bg-inset [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[85%]",
].join(" ");

export function ReleaseCard({ release }: { release: Release }) {
  const notesHtml = marked.parse(release.notes, { async: false });
  const released = DATE_FMT.format(new Date(release.releasedAt));
  const fileName = release.pdfPath?.split("/").pop();
  const downloadName = release.latest ? LATEST_DOWNLOAD_NAME : fileName;

  return (
    <li className="grid grid-cols-1 gap-3 md:grid-cols-[180px_minmax(0,1fr)] md:gap-6">
      {/* Left rail (GitHub release meta). Stacks above the card on mobile. */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted md:flex-col md:items-start md:pt-4">
        <time dateTime={release.releasedAt}>{released}</time>
        <span className="inline-flex items-center gap-1.5 font-mono text-xs">
          <TagIcon />
          {release.version}
        </span>
      </div>

      <article
        aria-labelledby={`release-${release.version}`}
        className="min-w-0 rounded-md border border-line"
      >
        <div className="p-4 sm:p-6">
          <div className="flex flex-wrap items-center gap-3">
            <h2 id={`release-${release.version}`} className="text-2xl font-semibold">
              {release.version}
            </h2>
            {release.latest && (
              <span className="rounded-full border border-success px-2.5 py-0.5 text-xs font-medium text-success">
                Latest
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-muted">
            <span className="font-semibold text-ink">{site.owner}</span> released this on{" "}
            {released}
          </p>

          <div className={`mt-4 ${NOTES_CLASS}`} dangerouslySetInnerHTML={{ __html: notesHtml }} />
        </div>

        <div className="border-t border-line px-4 py-4 sm:px-6">
          <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
            Assets
            <span className="rounded-full bg-hover px-1.5 py-0.5 text-xs font-medium leading-none">
              {release.pdfPath ? 1 : 0}
            </span>
          </h3>

          {release.pdfPath ? (
            <>
              <p className="mb-3 flex items-center justify-between gap-3 rounded-md border border-line-muted px-3 py-2 text-sm">
                <span className="flex min-w-0 items-center gap-2">
                  <span className="text-muted">
                    <FileIcon />
                  </span>
                  <span className="truncate font-medium">{downloadName}</span>
                </span>
                {release.sizeKb !== undefined && (
                  <span className="shrink-0 text-xs text-muted">{release.sizeKb} KB</span>
                )}
              </p>
              <PdfInlineViewer pdfPath={release.pdfPath} title={`Résumé ${release.version} (PDF)`}>
                <a
                  href={release.pdfPath}
                  download={downloadName}
                  className="inline-flex items-center gap-2 rounded-md bg-btn-primary px-3 py-1.5 text-sm font-semibold text-white transition-[filter] duration-200 hover:brightness-110"
                >
                  <DownloadIcon />
                  Download PDF
                </a>
              </PdfInlineViewer>
            </>
          ) : (
            <p className="text-sm text-muted">No PDF attached to this release.</p>
          )}
        </div>
      </article>
    </li>
  );
}
