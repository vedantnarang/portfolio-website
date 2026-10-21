import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { Prose } from "@/components/prose";
import { StateIcon } from "@/components/state-icon";
import { LabelPill } from "@/components/label-pill";
import { GitPullRequestIcon, PinIcon } from "@/components/icons";
import { getIssue, getIssueIds } from "@/lib/content";
import { site } from "@/data/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return getIssueIds().map((id) => ({ id: String(id) }));
}

const DATE_FMT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

async function load(idParam: string) {
  const id = Number(idParam);
  return Number.isInteger(id) ? getIssue(id) : null;
}

export async function generateMetadata({
  params,
}: PageProps<"/issues/[id]">): Promise<Metadata> {
  const { id } = await params;
  const issue = await load(id);
  if (!issue) return { title: "Issue" };
  return {
    title: `${issue.title} #${issue.id}`,
    description: `Backlog issue #${issue.id} — ${issue.title}.`,
  };
}

/* Issue detail: body only, no comment threads (PLAN Phase 3 §2). Mirrors
   the contact success page so both read as the same GitHub surface. */
export default async function IssueDetailPage({ params }: PageProps<"/issues/[id]">) {
  const { id } = await params;
  const issue = await load(id);
  if (!issue) notFound();

  const Body = issue.body.Component;
  const closed = issue.state === "closed";
  const date = closed ? issue.closedAt : issue.openedAt;

  return (
    <PageShell>
      <main className="py-6">
        <p className="mb-2 text-sm text-muted">
          <Link href={closed ? "/issues/closed" : "/issues"} className="text-link hover:underline">
            Issues
          </Link>{" "}
          / #{issue.id}
        </p>

        <header className="border-b border-line pb-4">
          <h1 className="text-xl font-semibold leading-7 break-words sm:text-2xl">
            {issue.title} <span className="font-normal text-muted">#{issue.id}</span>
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-semibold text-white ${closed ? "bg-done" : "bg-success"}`}
            >
              <StateIcon state={closed ? "completed" : "open"} className="text-white" />
              {closed ? "Closed" : "Open"}
            </span>
            <span>
              <span className="font-semibold text-ink">{site.owner}</span>{" "}
              {closed ? "closed this as completed" : "opened this issue"}
              {date && (
                <>
                  {" "}on <time dateTime={date}>{DATE_FMT.format(new Date(date))}</time>
                </>
              )}
            </span>
          </div>
        </header>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_240px]">
          <article className="min-w-0 overflow-hidden rounded-md border border-line">
            <div className="flex items-center gap-2 border-b border-line bg-subtle px-4 py-2.5 text-sm">
              <span
                aria-hidden
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-inset font-mono text-xs font-semibold text-muted"
              >
                {site.owner.charAt(0).toUpperCase()}
              </span>
              <span className="font-semibold">{site.owner}</span>
              <span className="text-muted">commented</span>
            </div>
            <div className="p-4 sm:p-6">
              <Prose>
                <Body />
              </Prose>
            </div>
          </article>

          <aside className="space-y-4 text-sm lg:border-l lg:border-line-muted lg:pl-6">
            <section>
              <h2 className="mb-2 text-xs font-semibold text-muted">Labels</h2>
              <div className="flex flex-wrap gap-1">
                {issue.labels.map((label) => (
                  <LabelPill key={label.name} {...label} />
                ))}
              </div>
            </section>
            {issue.relatedPr !== undefined && (
              <section className="border-t border-line-muted pt-4">
                <h2 className="mb-2 text-xs font-semibold text-muted">Related pull request</h2>
                <Link
                  href={`/pull/${issue.relatedPr}/conversation`}
                  className="inline-flex items-center gap-1.5 text-link hover:underline"
                >
                  <GitPullRequestIcon />#{issue.relatedPr}
                </Link>
              </section>
            )}
            {issue.fixedIn && (
              <section className="border-t border-line-muted pt-4">
                <h2 className="mb-2 text-xs font-semibold text-muted">Fixed in</h2>
                <ul className="flex flex-wrap gap-1.5">
                  {issue.fixedIn.map((hash) => (
                    <li key={hash}>
                      <code className="select-all rounded-md bg-inset px-1.5 py-0.5 font-mono text-xs">
                        {hash}
                      </code>
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-xs text-muted">Private team repository.</p>
              </section>
            )}
            {issue.pinned && (
              <p className="flex items-center gap-1.5 border-t border-line-muted pt-4 text-muted">
                <PinIcon />
                Pinned issue
              </p>
            )}
            <p className="border-t border-line-muted pt-4 text-muted">
              Have a take on this?{" "}
              <Link href="/issues/new" className="text-link hover:underline">
                Open an issue
              </Link>
              .
            </p>
          </aside>
        </div>
      </main>
    </PageShell>
  );
}
