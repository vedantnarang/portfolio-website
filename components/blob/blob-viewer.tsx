import type { ContributingView } from "@/types/content";
import Link from "next/link";
import { Prose } from "@/components/prose";
import { CodeIcon, FileIcon } from "@/components/icons";
import { site } from "@/data/site";
import { CopySourceButton } from "@/components/blob/copy-source-button";

/* GitHub file-viewer chrome (spec §8): repo breadcrumb, Raw/Copy top-right,
   rendered markdown as the primary pane, plus a zero-JS <details> source
   pane with true line numbers via CSS counters. Raw serves the exact source
   as a data-URI download — stays fully static, no runtime route needed.
   Gutter and code share one grid row, so they scroll/wrap together <640px. */

const FILE_PATH = "CONTRIBUTING.md";

function SourcePane({ raw }: { raw: string }) {
  const lines = raw.split("\n");
  return (
    <div className="[counter-reset:line] overflow-hidden rounded-md bg-canvas font-mono text-xs leading-5">
      {lines.map((line, i) => (
        <div key={i} className="grid grid-cols-[3rem_1fr] hover:bg-hover">
          <span
            aria-hidden
            className="select-none border-r border-line-muted pr-2 text-right text-faint [counter-increment:line] before:content-[counter(line)]"
          />
          <span className="whitespace-pre-wrap break-words pl-4">
            {line === "" ? "\u00A0" : line}
          </span>
        </div>
      ))}
    </div>
  );
}

export function BlobViewer({ view }: { view: ContributingView }) {
  const Body = view.html.Component;
  const bytes = Buffer.byteLength(view.raw, "utf8");
  const sizeKb = (bytes / 1024).toFixed(1);
  const rawHref = `data:text/plain;charset=utf-8,${encodeURIComponent(view.raw)}`;

  return (
    <div className="overflow-hidden rounded-md border border-line">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-line-muted bg-subtle px-4 py-2.5">
        <p className="flex min-w-0 flex-wrap items-center gap-x-1.5 text-sm">
          <a
            href={site.githubProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-link hover:underline"
          >
            {site.owner}
          </a>
          <span aria-hidden className="text-muted">/</span>
          <Link href="/" className="text-link hover:underline">
            {site.repo}
          </Link>
          <span aria-hidden className="text-muted">/</span>
          <span className="text-muted">blob</span>
          <span aria-hidden className="text-muted">/</span>
          <span className="font-mono text-xs text-muted">{site.defaultBranch}</span>
          <span aria-hidden className="text-muted">/</span>
          <span className="inline-flex items-center gap-1.5 font-semibold text-ink">
            <FileIcon />
            {FILE_PATH}
          </span>
        </p>

        <div className="flex items-center gap-2">
          <a
            href={rawHref}
            download={FILE_PATH}
            title="Download raw markdown"
            className="inline-flex items-center gap-1.5 rounded-md border border-line bg-subtle px-2 py-1 text-xs font-medium text-muted transition-colors duration-150 hover:bg-hover hover:text-link"
          >
            <CodeIcon />
            Raw
          </a>
          <CopySourceButton raw={view.raw} />
        </div>
      </div>

      <p className="border-b border-line-muted px-4 py-2 text-xs text-muted">
        {view.lineCount} lines · {sizeKb} KB
      </p>

      <div className="p-4 sm:p-6">
        <Prose>
          <Body />
        </Prose>
      </div>

      <details className="group border-t border-line-muted">
        <summary className="flex cursor-pointer select-none items-center gap-1.5 px-4 py-2.5 text-xs font-medium text-link hover:bg-hover [&::-webkit-details-marker]:hidden">
          <span className="group-open:hidden">
            View source ({view.lineCount} lines)
          </span>
          <span className="hidden group-open:inline">Hide source</span>
        </summary>
        <div className="border-t border-line-muted p-4">
          <SourcePane raw={view.raw} />
        </div>
      </details>
    </div>
  );
}
