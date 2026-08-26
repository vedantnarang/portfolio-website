import type { Metadata } from "next";
import { notFound } from "next/navigation";
import fs from "node:fs";
import path from "node:path";
import { PageShell } from "@/components/page-shell";
import { Prose } from "@/components/prose";
import { StateIcon } from "@/components/state-icon";
import { LabelPill } from "@/components/label-pill";
import { getIssues } from "@/lib/content";
import { PinIcon } from "@/components/icons";
import { site } from "@/data/site";

export const dynamicParams = false;

/* Sync filename read mirroring lib/content issueFiles() —
   generateStaticParams must run synchronously. */
function getIssueIdsSync(): number[] {
  const dir = path.join(process.cwd(), "content", "issues");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => parseInt(f, 10))
    .filter((n) => Number.isInteger(n));
}

export function generateStaticParams() {
  return getIssueIdsSync().map((id) => ({ id: String(id) }));
}

async function getIssue(idParam: string) {
  const id = Number(idParam);
  if (!Number.isInteger(id)) return null;
  const all = await getIssues();
  return all.find((i) => i.id === id) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const issue = await getIssue(id);
  if (!issue) return { title: "Issue" };
  return {
    title: `${issue.title} · Issue #${issue.id}`,
    description: `Backlog item — ${issue.title}.`,
  };
}

export default async function IssueDetailPage({
  params,
}: PageProps<"/issues/[id]">) {
  const { id } = await params;
  const issue = await getIssue(id);
  if (!issue) notFound();

  const Body = issue.body.Component;

  return (
    <PageShell>
      <main className="py-6">
        <h1 className="text-2xl font-semibold leading-tight text-ink">
          {issue.title}{" "}
          <span className="font-normal text-muted">#{issue.id}</span>
        </h1>

        <div className="mt-2 flex flex-wrap items-center gap-2 border-b border-line-muted pb-4">
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-success-tint px-2.5 py-0.5 text-sm font-medium text-success">
            <StateIcon state="open" />
            Open
          </span>
          {issue.pinned ? (
            <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-line px-2.5 py-0.5 text-sm font-medium text-muted">
              <PinIcon />
              Pinned
            </span>
          ) : null}
          {issue.labels.map((label) => (
            <LabelPill key={label.name} {...label} />
          ))}
        </div>

        <article className="mt-6 overflow-hidden rounded-md border border-line">
          <div className="border-b border-line-muted bg-subtle px-4 py-2.5 text-sm">
            <span className="font-semibold">{site.owner}</span>{" "}
            <span className="text-muted">opened this issue</span>
          </div>
          <div className="p-4 sm:p-6">
            <Prose>
              <Body />
            </Prose>
          </div>
        </article>
      </main>
    </PageShell>
  );
}
