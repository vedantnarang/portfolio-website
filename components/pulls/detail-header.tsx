import type { PrState } from "@/types/content";
import { StateIcon, type AnyState } from "@/components/state-icon";
import { LabelPill } from "@/components/label-pill";
import { RelativeTime } from "@/components/relative-time";
import { BranchIcon } from "@/components/icons";
import { site } from "@/data/site";

/* Detail header (spec §3): state pill, title+#id, branch/meta row,
   diff stats, label pills, Live/Repo buttons. */

const BADGE: Record<AnyState, string> = {
  open: "bg-success text-white",
  merged: "bg-done text-white",
  closed: "bg-danger text-white",
  draft: "bg-neutral text-canvas",
};

const BADGE_LABEL: Record<PrState | "closed", string> = {
  open: "Open",
  merged: "Merged",
  closed: "Closed",
  draft: "Draft",
};

export function DetailHeader({ pr }: { pr: PullRequestLike }) {
  return (
    <header className="pb-4">
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
        <h1 className="min-w-0 text-xl font-semibold leading-7 sm:text-2xl">
          {pr.title}{" "}
          <span className="font-normal text-muted">#{pr.id}</span>
        </h1>
        <div className="flex shrink-0 gap-2">
          {pr.liveUrl && (
            <a
              href={pr.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-md border border-line bg-subtle px-3 py-1.5 text-sm font-medium transition-colors duration-200 hover:bg-hover"
            >
              Live ↗
            </a>
          )}
          {pr.repoUrl && (
            <a
              href={pr.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-md border border-line bg-subtle px-3 py-1.5 text-sm font-medium transition-colors duration-200 hover:bg-hover"
            >
              Repo
            </a>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-semibold ${BADGE[pr.state]}`}
        >
          <StateIcon state={pr.state} />
          {BADGE_LABEL[pr.state]}
        </span>
        <span className="text-muted">
          {site.owner}{" "}
          {pr.mergedAt ? "merged" : "opened"}{" "}
          <RelativeTime date={pr.mergedAt ?? pr.openedAt ?? ""} />
        </span>
        <span className="inline-flex items-center gap-1 text-muted">
          <BranchIcon />
          <span className="rounded-md border border-line bg-subtle px-1.5 py-0.5 font-mono text-xs text-ink">
            {pr.branch}
          </span>
        </span>
        <span className="font-mono text-xs">
          <span className="text-success">+{pr.additions.toLocaleString("en-US")}</span>{" "}
          <span className="text-danger">{"\u2212"}{pr.deletions.toLocaleString("en-US")}</span>
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {pr.labels.map((label) => (
          <LabelPill key={label.name} {...label} />
        ))}
      </div>
    </header>
  );
}

interface PullRequestLike {
  id: number;
  title: string;
  state: PrState;
  branch: string;
  labels: Array<{ name: string; kind: "area" | "priority" | "meta" }>;
  additions: number;
  deletions: number;
  liveUrl?: string;
  repoUrl?: string;
  openedAt?: string;
  mergedAt?: string;
}
