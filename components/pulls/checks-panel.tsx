import type { PullRequest } from "@/types/content";
import { StateIcon } from "@/components/state-icon";
import { RelativeTime } from "@/components/relative-time";

/* Static checks panel (PLAN assumption 5: live health checks are cut).
   Rows render only what frontmatter honestly knows — no fake ✓. */
export function ChecksPanel({ pr }: { pr: PullRequest }) {
  const monitored = Boolean(pr.lastChecked);

  return (
    <section
      aria-label="Checks"
      className="overflow-hidden rounded-md border border-line"
    >
      <div className="flex items-center justify-between border-b border-line-muted bg-subtle px-4 py-2.5 text-sm">
        <h2 className="font-semibold">Checks</h2>
        <p className="text-xs text-muted">
          {monitored ? "1 check" : "0 active checks"}
        </p>
      </div>

      <ul className="divide-y divide-line-muted text-sm">
        <li className="flex items-center gap-3 px-4 py-3">
          <StateIcon state={monitored ? "open" : "draft"} />
          <div className="min-w-0 flex-1">
            <p className="font-medium">live-site / {pr.branch}</p>
            <p className="truncate text-xs text-muted">
              {pr.liveUrl ? (
                <a
                  href={pr.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-link hover:underline"
                >
                  {pr.liveUrl}
                </a>
              ) : (
                "no public URL"
              )}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <span className="inline-block rounded-full border border-line px-2 py-0.5 text-xs font-medium text-muted">
              not monitored
            </span>
            <p className="mt-1 text-xs text-muted">
              {pr.lastChecked ? (
                <>
                  verified <RelativeTime date={pr.lastChecked} />
                </>
              ) : (
                "health fetches intentionally static"
              )}
            </p>
          </div>
        </li>
      </ul>

      <p className="border-t border-line-muted px-4 py-2.5 text-xs text-faint">
        Live health endpoints were deliberately cut from this site — this
        panel reflects build-time data only.
      </p>
    </section>
  );
}
