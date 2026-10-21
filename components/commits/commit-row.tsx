import type { CareerCommit } from "@/types/content";
import { CopyButton } from "@/components/copy-button";
import { VerifiedBadge } from "@/components/commits/verified-badge";
import { site } from "@/data/site";

/* Dates are calendar dates, not instants — format in UTC so the build
   machine's timezone can't shift them a day. */
const DATE_FMT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

/* One career event as a GitHub commit row (spec §4). The body expands
   via native <details> — zero JS (PLAN Phase 3 §7.2). The hash is
   select-all text beside the copy button, so it stays copyable when the
   Clipboard API is blocked. */
export function CommitRow({ commit }: { commit: CareerCommit }) {
  const meta = (
    <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted sm:text-sm">
      <span>
        <span className="font-semibold text-ink">{site.owner}</span> committed on{" "}
        <time dateTime={commit.date}>{DATE_FMT.format(new Date(commit.date))}</time>
      </span>
      {commit.verified && <VerifiedBadge />}
    </p>
  );

  return (
    <li className="flex items-start gap-4 px-4 py-3 transition-colors duration-150 hover:bg-hover">
      <div className="min-w-0 flex-1">
        {commit.body ? (
          <details className="group">
            <summary className="cursor-pointer list-none rounded-sm [&::-webkit-details-marker]:hidden">
              <span className="font-semibold leading-6 break-words">{commit.message}</span>{" "}
              <span
                aria-hidden
                className="ml-1 inline-flex h-4 items-center rounded-sm bg-hover px-1 align-middle text-xs leading-none text-muted group-open:bg-link-tint group-open:text-link"
              >
                …
              </span>
              <span className="sr-only"> (show description)</span>
            </summary>
            {meta}
            <p className="mt-3 max-w-prose whitespace-pre-line border-l-2 border-line pl-3 font-mono text-xs leading-5 text-muted">
              {commit.body}
            </p>
          </details>
        ) : (
          <p className="font-semibold leading-6 break-words">{commit.message}</p>
        )}
        {!commit.body && meta}
      </div>

      <div className="flex shrink-0 items-center gap-0.5">
        <code className="select-all rounded-md px-1.5 py-1 font-mono text-xs text-muted">
          {commit.hash}
        </code>
        <CopyButton text={commit.hash} label={`Copy commit hash ${commit.hash}`} />
      </div>
    </li>
  );
}
