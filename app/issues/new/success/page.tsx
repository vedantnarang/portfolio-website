import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { StateIcon } from "@/components/state-icon";
import { LabelPill } from "@/components/label-pill";
import { getNextIssueNumber } from "@/lib/issue-number";
import { getTemplate } from "@/lib/contact-templates";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "New issue opened",
  robots: { index: false },
};

/* Completion of the metaphor (spec §6): no toast — the "success screen"
   IS a fake GitHub issue page, `#N opened by you · just now`, with the
   owner's auto-reply comment. Submitted content crosses over via the
   short-lived cookies the server action set before redirecting. */
export default async function IssueSuccessPage() {
  const store = await cookies();
  const title = store.get("new-issue-title")?.value;
  if (!title) redirect("/issues/new");
  const template = getTemplate(store.get("new-issue-template")?.value ?? "");
  const issueNumber = getNextIssueNumber();

  return (
    <PageShell>
      <main className="py-6">
        <p className="mb-2 text-sm text-muted">
          <Link href="/issues" className="text-link hover:underline">
            Issues
          </Link>{" "}
          / #{issueNumber}
        </p>

        <article className="min-w-0">
          <div className="border-b border-line pb-4">
            <h1 className="flex flex-wrap items-center gap-2 text-xl font-semibold leading-7 sm:text-2xl">
              <StateIcon state="open" className="mt-1" />
              <span className="min-w-0 break-words">{title}</span>
              <span className="font-normal text-muted">#{issueNumber}</span>
            </h1>
            <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
              opened by <strong className="font-medium">you</strong> · just
              now
              {template && (
                <>
                  <span aria-hidden>·</span>
                  <LabelPill name={template.label} kind="meta" />
                </>
              )}
            </p>          </div>

          <section aria-label="Comment thread">
            <div className="mt-4 rounded-md border border-line">
              <header className="flex items-center gap-2 border-b border-line bg-subtle px-4 py-2.5 text-sm">
                <span
                  aria-hidden
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-inset font-mono text-sm font-semibold text-muted"
                >
                  {site.owner.charAt(0).toUpperCase()}
                </span>
                <span className="font-semibold">{site.owner}</span>
                <span className="text-muted">commented · just now</span>
              </header>
              <div className="px-4 py-3 text-sm leading-7">
                <p>
                  Thanks — I&#39;ll get back to you within a day. The issue
                  landed in my inbox with everything above.
                </p>
              </div>
            </div>
          </section>

          <p className="mt-6 text-sm text-muted">
            You can close this now —{" "}
            <Link href="/" className="text-link hover:underline">
              back to the repository
            </Link>
            .
          </p>
        </article>
      </main>
    </PageShell>
  );
}
