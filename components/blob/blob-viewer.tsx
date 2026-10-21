import { CopyButton } from "@/components/copy-button";

/* GitHub file viewer chrome (spec §8). Preview | Code is a CSS-only
   radio toggle (zero JS; with CSS off both panes simply stack). Line
   numbers are CSS counters, so they share a row with their line — they
   stay aligned at any zoom — and are never part of a text selection.
   Raw/Copy always serve the exact source. */
export function BlobViewer({
  fileName,
  raw,
  lineCount,
  rawHref,
  children,
}: {
  fileName: string;
  raw: string;
  lineCount: number;
  rawHref: string;
  /** The rendered (Preview) form of the file. */
  children: React.ReactNode;
}) {
  const lines = raw.split("\n");
  const bytes = new TextEncoder().encode(raw).length;
  const size = bytes < 1024 ? `${bytes} Bytes` : `${(bytes / 1024).toFixed(1)} KB`;

  return (
    <section aria-label={fileName} className="group/blob overflow-hidden rounded-md border border-line">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-subtle px-3 py-2">
        <div className="flex flex-wrap items-center gap-3">
          <fieldset className="flex rounded-md border border-line p-0.5 text-sm">
            <legend className="sr-only">View</legend>
            {(["preview", "code"] as const).map((view) => (
              <label
                key={view}
                className="cursor-pointer rounded-[5px] px-3 py-0.5 capitalize text-muted has-checked:bg-canvas has-checked:font-semibold has-checked:text-ink has-checked:shadow-[0_0_0_1px_var(--line)] has-focus-visible:outline-2 has-focus-visible:outline-link"
              >
                <input
                  type="radio"
                  name="blob-view"
                  value={view}
                  data-view={view}
                  defaultChecked={view === "preview"}
                  className="sr-only"
                />
                {view}
              </label>
            ))}
          </fieldset>
          <span className="text-xs text-muted">
            {lineCount} lines · {size}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <a
            href={rawHref}
            className="rounded-md border border-line bg-canvas px-3 py-0.5 text-sm font-medium transition-colors duration-150 hover:bg-hover"
          >
            Raw
          </a>
          <CopyButton text={raw} label={`Copy raw ${fileName}`} showText />
        </div>
      </div>

      <div className="p-4 sm:p-8 group-has-[[data-view=code]:checked]/blob:hidden">{children}</div>

      <div className="hidden overflow-x-auto py-2 font-mono text-xs leading-5 [counter-reset:line] group-has-[[data-view=code]:checked]/blob:block">
        {lines.map((line, i) => (
          <div
            key={i}
            id={`L${i + 1}`}
            className="grid grid-cols-[3.5rem_minmax(0,1fr)] [counter-increment:line] before:select-none before:pr-4 before:text-right before:text-faint before:content-[counter(line)] target:bg-warn-tint"
          >
            <span className="whitespace-pre-wrap break-words pr-4">{line}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
