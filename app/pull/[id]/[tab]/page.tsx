import type { Metadata } from "next";
import { notFound } from "next/navigation";
import fs from "node:fs";
import path from "node:path";
import { PageShell } from "@/components/page-shell";
import { Prose } from "@/components/prose";
import { DetailHeader } from "@/components/pulls/detail-header";
import { PrTabs, type PrTabKey } from "@/components/pulls/tabs";
import { ChecksPanel } from "@/components/pulls/checks-panel";
import { Diagram } from "@/components/mdx/diagram";
import { Diff } from "@/components/mdx/diff";
import { getAllPullRequests, getPullDiffBlocks } from "@/lib/content";

const TAB_KEYS: PrTabKey[] = [
  "conversation",
  "architecture",
  "checks",
  "files",
];

export const dynamicParams = false;

export function generateStaticParams() {
  return getPullIdsSync().flatMap((id) =>
    TAB_KEYS.map((tab) => ({ id: String(id), tab })),
  );
}

/* Sync filename read mirroring lib/content prFiles() —
   generateStaticParams must run synchronously. */
function getPullIdsSync(): number[] {
  const dir = path.join(process.cwd(), "content", "pulls");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => parseInt(f, 10))
    .filter((n) => Number.isInteger(n))
    .sort((a, b) => b - a);
}

async function getPr(idParam: string) {
  const id = Number(idParam);
  if (!Number.isInteger(id)) return null;
  const prs = await getAllPullRequests();
  return prs.find((p) => p.id === id) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; tab: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const pr = await getPr(id);
  if (!pr) return { title: "Pull request" };
  return {
    title: `${pr.title} #${pr.id}`,
    description: `Project case study — ${pr.title}, presented as a pull request.`,
  };
}

export default async function PullDetailPage({
  params,
}: PageProps<"/pull/[id]/[tab]">) {
  const { id, tab } = await params;
  const isTab = TAB_KEYS.includes(tab as PrTabKey);
  if (!isTab) notFound();

  const pr = await getPr(id);
  if (!pr) notFound();

  const Body = pr.body.Component;

  return (
    <PageShell>
      <main className="py-6">
        <DetailHeader pr={pr} />
        <PrTabs prId={pr.id} active={tab as PrTabKey} />

        <div
          role="tabpanel"
          id={`panel-${tab}`}
          aria-labelledby={`tab-${tab}`}
          className="pt-6"
        >
          {tab === "conversation" && (
            <article className="overflow-hidden rounded-md border border-line">
              <div className="flex items-center gap-2 border-b border-line-muted bg-subtle px-4 py-2.5 text-sm">
                <span className="font-semibold">{pr.branch}</span>
                <span className="text-muted">
                  opened this pull request
                  {pr.openedAt ? (
                    <>
                      {" "}
                      on{" "}
                      <time dateTime={pr.openedAt}>
                        {new Date(pr.openedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </time>
                    </>
                  ) : null}
                </span>
              </div>
              <div className="p-4 sm:p-6">
                <Prose>
                  <Body />
                </Prose>
              </div>
            </article>
          )}

          {tab === "architecture" && (
            <ArchitecturePanel prId={pr.id} title={pr.title} />
          )}

          {tab === "checks" && <ChecksPanel pr={pr} />}

          {tab === "files" && <FilesChanged prId={pr.id} />}
        </div>
      </main>
    </PageShell>
  );
}

function ArchitecturePanel({ prId, title }: { prId: number; title: string }) {
  const svgPath = path.join(
    process.cwd(),
    "public",
    "diagrams",
    `pr-${prId}.svg`,
  );
  if (!fs.existsSync(svgPath)) {
    return (
      <Placeholder label="Diagram ships with this pull request's exemplar content." />
    );
  }
  return (
    <Diagram
      id={prId}
      alt={`Architecture diagram for ${title}`}
      caption="System-level view — pre-rendered SVG, no client JS."
    />
  );
}

function FilesChanged({ prId }: { prId: number }) {
  const blocks = getPullDiffBlocks(prId);

  if (blocks.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-line px-6 py-16 text-center text-sm text-muted">
        No diffs published for this pull request yet.
      </div>
    );
  }

  const summary = blocks.reduce(
    (acc, b) => ({
      files: acc.files + 1,
      additions: acc.additions + (b.additions ?? 0),
      deletions: acc.deletions + (b.deletions ?? 0),
    }),
    { files: 0, additions: 0, deletions: 0 },
  );

  return (
    <div>
      <p className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
        <span>
          Showing{" "}
          <span className="font-semibold text-ink">{summary.files}</span>{" "}
          changed file{summary.files === 1 ? "" : "s"} with real code from this
          project.
        </span>
        <span className="font-mono text-xs">
          <span className="text-success">
            +{summary.additions.toLocaleString("en-US")}
          </span>{" "}
          <span className="text-danger">
            {"\u2212"}{summary.deletions.toLocaleString("en-US")}
          </span>
        </span>
      </p>
      {blocks.map((block) => (
        <Diff
          key={block.file}
          file={block.file}
          lang={block.lang}
          additions={block.additions}
          deletions={block.deletions}
        >
          {block.code}
        </Diff>
      ))}
    </div>
  );
}

function Placeholder({ label }: { label: string }) {
  return (
    <div className="rounded-md border border-dashed border-line px-6 py-16 text-center text-sm text-muted">
      {label}
    </div>
  );
}
