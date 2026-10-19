import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { IssueForm } from "@/components/contact/issue-form";
import { FallbackLinks } from "@/components/contact/fallback-links";

export const metadata: Metadata = {
  title: "New issue — Contact",
  description: "Open an issue to get in touch: job opportunities, collaborations, or just saying hi.",
};

export default function NewIssuePage() {
  return (
    <PageShell>
      <main className="py-6">
        <h1 className="mb-1 text-xl font-semibold leading-7">
          Create new issue
        </h1>
        <p className="mb-6 text-sm text-muted">
          Your issue graduates straight to my inbox — replies within a day.
        </p>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_296px]">
          <div className="min-w-0">
            <IssueForm />
          </div>
          <aside className="min-w-0">
            <FallbackLinks />
          </aside>
        </div>
      </main>
    </PageShell>
  );
}
