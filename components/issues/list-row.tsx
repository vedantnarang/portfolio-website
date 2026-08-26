import Link from "next/link";
import type { Issue } from "@/types/content";
import { StateIcon } from "@/components/state-icon";
import { LabelPill } from "@/components/label-pill";
import { PinIcon } from "@/components/icons";
import { site } from "@/data/site";

/* GitHub issue list row — variant of PullListRow (spec §5): open state
   icon, title+#id, pin glyph for pinned, meta line, label pills.
   No commits/files-changed stats; meta wraps under 480px via flex-wrap. */
export function IssueListRow({ issue }: { issue: Issue }) {
  return (
    <li className="relative px-4 py-4 transition-colors duration-150 hover:bg-hover">
      <div className="flex gap-3">
        <div className="flex pt-0.5">
          <StateIcon state="open" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold leading-6">
            {issue.pinned ? (
              <span
                aria-label="Pinned"
                title="Pinned"
                className="mr-1.5 inline-block align-text-bottom text-muted"
              >
                <PinIcon />
              </span>
            ) : null}
            <Link
              href={`/issues/${issue.id}`}
              className="text-ink after:absolute after:inset-0 hover:text-link"
            >
              {issue.title}
            </Link>{" "}
            <span className="font-normal text-muted">#{issue.id}</span>
          </p>
          <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted sm:text-sm">
            <span>opened by {site.owner}</span>
          </p>
        </div>
        <div className="hidden shrink-0 items-start gap-1.5 sm:flex">
          {issue.labels.map((label) => (
            <LabelPill key={label.name} {...label} />
          ))}
        </div>
      </div>
    </li>
  );
}
