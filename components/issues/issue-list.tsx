import Link from "next/link";
import type { IssueState } from "@/types/content";
import { IssueListRow } from "@/components/issues/list-row";
import { CheckIcon, IssueOpenedIcon } from "@/components/icons";
import { getIssueCounts, getIssues } from "@/lib/content";

/* GitHub's "N Open · ✓ M Closed" toggle. Each state is its own static
   route (/issues, /issues/closed) rather than a ?state= param, so the
   backlog never opts into request rendering (PLAN Phase 4.5 §7.1). */
export async function IssueList({ state }: { state: IssueState }) {
  const [issues, counts] = await Promise.all([getIssues(state), getIssueCounts()]);

  const toggle = [
    { state: "open", href: "/issues", label: `${counts.open} Open`, Icon: IssueOpenedIcon },
    { state: "closed", href: "/issues/closed", label: `${counts.closed} Closed`, Icon: CheckIcon },
  ] as const;

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">Issues</h1>
        <Link
          href="/issues/new"
          className="inline-flex items-center rounded-md bg-btn-primary px-3 py-1.5 text-sm font-semibold text-white transition-[filter] duration-200 hover:brightness-110"
        >
          New issue
        </Link>
      </div>

      <div className="overflow-hidden rounded-md border border-line">
        <nav aria-label="Issue state" className="flex gap-4 border-b border-line-muted bg-subtle px-4 py-2.5">
          {toggle.map((t) => {
            const active = t.state === state;
            return (
              <Link
                key={t.state}
                href={t.href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-2 text-sm transition-colors duration-150 ${
                  active ? "font-semibold text-ink" : "text-muted hover:text-ink"
                }`}
              >
                <t.Icon />
                {t.label}
              </Link>
            );
          })}
        </nav>
        {issues.length > 0 ? (
          <ul className="divide-y divide-line-muted">
            {issues.map((issue) => (
              <IssueListRow key={issue.id} issue={issue} />
            ))}
          </ul>
        ) : (
          <p className="px-4 py-16 text-center text-sm text-muted">No {state} issues.</p>
        )}
      </div>
    </>
  );
}
