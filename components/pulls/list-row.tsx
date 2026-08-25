import Link from "next/link";
import type { PullRequest } from "@/types/content";
import { StateIcon } from "@/components/state-icon";
import { LabelPill } from "@/components/label-pill";
import { RelativeTime } from "@/components/relative-time";
import { site } from "@/data/site";

/* GitHub PR list row (spec §3): state icon, title+#id, meta line,
   label pills, relative timestamp. Meta wraps under 480px via flex-wrap. */
export function PullListRow({ pr }: { pr: PullRequest }) {
  return (
    <li className="relative px-4 py-4 transition-colors duration-150 hover:bg-hover">
      <div className="flex gap-3">
        <div className="flex pt-0.5">
          <StateIcon state={pr.state} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold leading-6">
            <Link
              href={`/pull/${pr.id}/conversation`}
              className="text-ink after:absolute after:inset-0 hover:text-link"
            >
              {pr.title}
            </Link>{" "}
            <span className="font-normal text-muted">#{pr.id}</span>
          </p>
          <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted sm:text-sm">
            <span>
              opened by {site.owner}
              {pr.mergedAt ? " · merged" : ""} · {pr.commits} commits ·{" "}
              {pr.filesChanged} files changed
            </span>
            <RelativeTime
              date={pr.mergedAt ?? pr.openedAt ?? pr.lastChecked ?? ""}
              className="whitespace-nowrap"
            />
          </p>
        </div>
        <div className="hidden shrink-0 items-start gap-1.5 sm:flex">
          {pr.labels.map((label) => (
            <LabelPill key={label.name} {...label} />
          ))}
        </div>
      </div>
    </li>
  );
}
