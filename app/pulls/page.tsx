import type { Metadata } from "next";
import { Suspense } from "react";
import { PageShell } from "@/components/page-shell";
import { PullListRow } from "@/components/pulls/list-row";
import { FilterChips } from "@/components/pulls/filter-chips";
import { getAllPullRequests } from "@/lib/content";
import { GitPullRequestIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Pull requests",
  description: "Projects and work, presented as pull requests.",
};

/* Reading searchParams opts this route into request rendering — the
   documented tradeoff for shareable filter links (PLAN Phase 2 §7.4/risk
   table). Everything else on the site stays fully static. */
export default async function PullsPage({
  searchParams,
}: PageProps<"/pulls">) {
  const { label } = await searchParams;
  const all = await getAllPullRequests();
  const prs =
    typeof label === "string"
      ? all.filter((pr) => pr.labels.some((l) => l.name === label))
      : all;

  return (
    <PageShell>
      <main className="py-6">
        <h1 className="sr-only">Pull requests</h1>

        <div className="overflow-hidden rounded-md border border-line">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line-muted bg-subtle px-4 py-2.5">
            <Suspense fallback={<div className="h-7" />}>
              <FilterChips />
            </Suspense>
            <p className="flex items-center gap-2 text-sm font-medium text-muted">
              <GitPullRequestIcon />
              {prs.length} of {all.length}
            </p>
          </div>

          {prs.length > 0 ? (
            <ul className="divide-y divide-line-muted">
              {prs.map((pr) => (
                <PullListRow key={pr.id} pr={pr} />
              ))}
            </ul>
          ) : (
            <p className="px-4 py-16 text-center text-sm text-muted">
              No pull requests labeled{" "}
              <span className="font-mono">{label}</span>.
            </p>
          )}
        </div>
      </main>
    </PageShell>
  );
}
