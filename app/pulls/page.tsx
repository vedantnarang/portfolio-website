import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { getAllPullRequests } from "@/lib/content";
import { GitPullRequestIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Pull requests",
  description:
    "Projects and work, presented as pull requests. Detail views ship next.",
};

/* Phase 1 stub — proves the content pipeline end-to-end with real loader
   data; Phase 2 replaces this with the full PR list (state icons, filter
   chips, label pills) and /pull/[id]. */
export default async function PullsPage() {
  const prs = await getAllPullRequests();

  return (
    <PageShell>
      <main className="py-6">
        <h1 className="sr-only">Pull requests</h1>
        <div className="overflow-hidden rounded-md border border-line">
          <div className="flex items-center gap-2 border-b border-line-muted bg-subtle px-4 py-2.5 text-sm font-semibold">
            <GitPullRequestIcon />
            {prs.length} pull requests
          </div>
          <ul className="divide-y divide-line-muted">
            {prs.map((pr) => (
              <li
                key={pr.id}
                className="flex items-baseline gap-3 px-4 py-3 transition-colors duration-150 hover:bg-hover"
              >
                <span className="text-sm text-muted">#{pr.id}</span>
                <span className="min-w-0 truncate text-sm font-semibold">
                  {pr.title}
                </span>
                <span className="ml-auto shrink-0 rounded-full bg-hover px-2 py-0.5 text-xs text-muted">
                  {pr.state}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </PageShell>
  );
}
