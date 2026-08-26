import type { CareerCommit } from "@/types/content";
import { GitCommitIcon } from "@/components/icons";
import { RelativeTime } from "@/components/relative-time";
import { CopyHashButton } from "@/components/commits/copy-hash";
import { VerifiedBadge } from "@/components/commits/verified-badge";

/* GitHub commit-list row (spec §4): message line, expandable body via
   native <details> (zero JS), meta line with copyable hash, optional
   verified badge, relative timestamp. Meta wraps under 480px via flex-wrap. */
export function CommitRow({ commit }: { commit: CareerCommit }) {
  return (
    <li className="px-4 py-3 transition-colors duration-150 hover:bg-hover">
      <div className="flex gap-3">
        <div className="pt-0.5 text-muted">
          <GitCommitIcon />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-6 text-ink">
            {commit.message}
          </p>

          {commit.body ? (
            <details className="group mt-1">
              <summary className="-ml-0.5 inline-flex cursor-pointer select-none items-center rounded px-0.5 text-xs text-link hover:underline [&::-webkit-details-marker]:hidden">
                <span className="group-open:hidden">Show details</span>
                <span className="hidden group-open:inline">Hide details</span>
              </summary>
              <p className="mt-1.5 border-l-2 border-line pl-3 text-sm leading-6 text-muted">
                {commit.body}
              </p>
            </details>
          ) : null}

          <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
            <CopyHashButton hash={commit.hash} />
            {commit.verified ? <VerifiedBadge /> : null}
            <RelativeTime
              date={commit.date}
              className="whitespace-nowrap"
            />
          </p>
        </div>
      </div>
    </li>
  );
}
