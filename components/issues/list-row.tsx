import Link from "next/link";
import type { Issue } from "@/types/content";
import { StateIcon } from "@/components/state-icon";
import { LabelPill } from "@/components/label-pill";
import { PinIcon } from "@/components/icons";
import { site } from "@/data/site";

const DATE_FMT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

/* GitHub issue row — the issue variant of PullListRow (PLAN Phase 3 §5).
   Labels sit inline after the title as on GitHub, so priority labels
   stay visible on mobile instead of hiding in a right-hand column. */
export function IssueListRow({ issue }: { issue: Issue }) {
  return (
    <li className="relative px-4 py-3 transition-colors duration-150 hover:bg-hover">
      <div className="flex gap-3">
        <div className="flex pt-1">
          <StateIcon state="open" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="leading-6">
            <Link
              href={`/issues/${issue.id}`}
              className="mr-1.5 font-semibold text-ink after:absolute after:inset-0 hover:text-link"
            >
              {issue.title}
            </Link>
            <span className="inline-flex flex-wrap gap-1 align-middle">
              {issue.labels.map((label) => (
                <LabelPill key={label.name} {...label} />
              ))}
            </span>
          </p>
          <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
            <span>
              #{issue.id}
              {issue.openedAt && (
                <>
                  {" "}opened on{" "}
                  <time dateTime={issue.openedAt}>
                    {DATE_FMT.format(new Date(issue.openedAt))}
                  </time>
                </>
              )}{" "}
              by {site.owner}
            </span>
            {issue.pinned && (
              <span className="inline-flex items-center gap-1 font-medium text-ink">
                <PinIcon />
                Pinned
              </span>
            )}
          </p>
        </div>
      </div>
    </li>
  );
}
