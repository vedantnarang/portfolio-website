import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { IssueList } from "@/components/issues/issue-list";

export const metadata: Metadata = {
  title: "Closed issues",
  description:
    "Backend, migration and FPL-integration fixes shipped on Flickstat — symptom, root cause, fix and verification.",
};

/* Closed half of the Open/Closed toggle — its own static route so
   /issues needs no searchParams. */
export default function ClosedIssuesPage() {
  return (
    <PageShell>
      <main className="py-6">
        <IssueList state="closed" />
      </main>
    </PageShell>
  );
}
