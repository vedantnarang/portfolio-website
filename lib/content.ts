import fs from "node:fs";
import path from "node:path";
import type {
  CareerCommit,
  Issue,
  Label,
  LabelKind,
  MDXContent,
  PullRequest,
  Release,
  Skills,
} from "@/types/content";
import { skills as skillsData } from "@/data/skills";
import { commits as commitData } from "@/data/commits";
import { releases as releaseData } from "@/data/releases";
import {
  ContentError,
  loadFrontmatter,
  validateIssueFrontmatter,
  validatePullFrontmatter,
} from "@/lib/mdx";

/* ============================================================
   Typed content layer. All functions are server-only (fs +
   dynamic MDX imports) and run at build time — fully static
   output, no ISR (PLAN §7.2).
   NOTE: dynamic imports use inline template literals so the
   bundler can statically discover every content module.
   ============================================================ */

const PR_DIR = path.join(process.cwd(), "content", "pulls");
const ISSUE_DIR = path.join(process.cwd(), "content", "issues");

/** Filter-chip/label names → pill kind (design.md §2 labels map). */
const LABEL_KINDS: Record<string, LabelKind> = {
  backend: "area",
  frontend: "area",
  data: "area",
  ai: "area",
  infra: "area",
  enhancement: "meta",
  "help wanted": "meta",
  "good first issue": "meta",
  question: "meta",
  learning: "meta",
  "tech-debt": "meta",
  P1: "priority",
  P2: "priority",
  P3: "priority",
};

export function toLabel(name: string): Label {
  return { name, kind: LABEL_KINDS[name] ?? "meta" };
}

/* ---------- pulls ---------- */

function prFiles(): Array<{ slug: string; fileId: number }> {
  if (!fs.existsSync(PR_DIR)) return [];
  return fs
    .readdirSync(PR_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => {
      const prefix = parseInt(f, 10);
      if (!Number.isInteger(prefix)) {
        throw new ContentError(
          `filename must start with the PR id (got "${f}")`,
          `content/pulls/${f}`,
        );
      }
      return { slug: f.replace(/\.mdx$/, ""), fileId: prefix };
    });
}

/** PR ids from filenames — sync, for generateStaticParams. */
export function getPullIds(): number[] {
  return prFiles()
    .map(({ fileId }) => fileId)
    .sort((a, b) => b - a);
}

/** Open-first, then id descending (PLAN §4). */
export async function getAllPullRequests(): Promise<PullRequest[]> {
  const prs = await Promise.all(
    prFiles().map(async ({ slug, fileId }) => {
      const fm = loadFrontmatter(`pulls/${slug}.mdx`, (data) =>
        validatePullFrontmatter(data, fileId),
      );
      const mod = await import(`@/content/pulls/${slug}.mdx`);
      if (typeof mod.default !== "function") {
        throw new ContentError(
          "compiled module has no default component",
          `content/pulls/${slug}.mdx`,
        );
      }
      const body: MDXContent = { Component: mod.default };
      return { ...fm, labels: fm.labels.map(toLabel), body } satisfies PullRequest;
    }),
  );
  const isOpen = (pr: PullRequest) => pr.state === "open";
  return prs.sort((a, b) => {
    if (isOpen(a) !== isOpen(b)) return isOpen(a) ? -1 : 1;
    return b.id - a.id;
  });
}

export async function getPullRequest(id: number): Promise<PullRequest> {
  const all = await getAllPullRequests();
  const pr = all.find((p) => p.id === id);
  if (!pr) throw new ContentError(`no pull request with id ${id}`, "content/pulls");
  return pr;
}

/* ---------- diff blocks (Files changed tab) ---------- */

export interface DiffBlock {
  file: string;
  lang: string;
  additions?: number;
  deletions?: number;
  /** Raw code including +/-/@@ classification markers. */
  code: string;
}

const DIFF_RE = /<Diff\s+([^>]*?)>\s*\{`([\s\S]*?)`\}\s*<\/Diff>/g;

function strAttr(attrs: string, name: string): string | undefined {
  const m = attrs.match(new RegExp(`${name}\\s*=\\s*"([^"]*)"`));
  return m?.[1];
}

function numAttr(attrs: string, name: string): number | undefined {
  const m = attrs.match(new RegExp(`${name}\\s*=\\s*\\{(\\d+)\\}`));
  return m ? parseInt(m[1], 10) : undefined;
}

/** Parse <Diff> blocks out of a PR's raw MDX at build time so the
   Files-changed tab can aggregate them without re-rendering the body. */
export function getPullDiffBlocks(id: number): DiffBlock[] {
  const entry = prFiles().find(({ fileId }) => fileId === id);
  if (!entry) return [];
  const raw = fs.readFileSync(path.join(PR_DIR, entry.slug + ".mdx"), "utf8");
  const blocks: DiffBlock[] = [];
  for (const match of raw.matchAll(DIFF_RE)) {
    const attrs = match[1];
    blocks.push({
      file: strAttr(attrs, "file") ?? "untitled",
      lang: strAttr(attrs, "lang") ?? "ts",
      additions: numAttr(attrs, "additions"),
      deletions: numAttr(attrs, "deletions"),
      code: match[2],
    });
  }
  return blocks;
}

/* ---------- readme ---------- */

export interface MDXResult {
  content: MDXContent;
}

export async function getReadme(): Promise<MDXResult> {
  const mod = await import("@/content/readme.mdx");
  if (typeof mod.default !== "function") {
    throw new ContentError("compiled module has no default component", "content/readme.mdx");
  }
  return { content: { Component: mod.default } };
}

/* ---------- issues ---------- */

function issueFiles(): Array<{ slug: string; fileId: number }> {
  if (!fs.existsSync(ISSUE_DIR)) return [];
  return fs
    .readdirSync(ISSUE_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => {
      const prefix = parseInt(f, 10);
      if (!Number.isInteger(prefix)) {
        throw new ContentError(
          `filename must start with the issue id (got "${f}")`,
          `content/issues/${f}`,
        );
      }
      return { slug: f.replace(/\.mdx$/, ""), fileId: prefix };
    });
}

/** Pinned first, then id descending (spec §5). */
export async function getIssues(): Promise<Issue[]> {
  const issues = await Promise.all(
    issueFiles().map(async ({ slug, fileId }) => {
      const fm = loadFrontmatter(`issues/${slug}.mdx`, (data) =>
        validateIssueFrontmatter(data, fileId),
      );
      const mod = await import(`@/content/issues/${slug}.mdx`);
      if (typeof mod.default !== "function") {
        throw new ContentError(
          "compiled module has no default component",
          `content/issues/${slug}.mdx`,
        );
      }
      const body: MDXContent = { Component: mod.default };
      return {
        id: fm.id,
        title: fm.title,
        labels: fm.labels.map(toLabel),
        pinned: fm.pinned,
        body,
      } satisfies Issue;
    }),
  );
  return issues.sort((a, b) => {
    if (Boolean(a.pinned) !== Boolean(b.pinned)) return a.pinned ? -1 : 1;
    return b.id - a.id;
  });
}

/* ---------- commits / releases (typed data modules) ---------- */

/** Career events, newest first — grouping into month sections is the
    page's concern (app/commits). */
export function getCommits(): CareerCommit[] {
  return [...commitData].sort((a, b) => b.date.localeCompare(a.date));
}

export function getReleases(): Release[] {
  // Build-time integrity guards (handoff §3): exactly one latest, and its
  // binary must exist or the releases page would advertise a dead download.
  const latestCount = releaseData.filter((r) => r.latest).length;
  if (latestCount !== 1) {
    throw new ContentError(
      `expected exactly one latest:true release, found ${latestCount}`,
      "data/releases.ts",
    );
  }
  for (const r of releaseData) {
    if (r.pdfPath && !fs.existsSync(path.join(process.cwd(), "public", r.pdfPath))) {
      throw new ContentError(
        `release ${r.version} references missing PDF ${r.pdfPath}`,
        "data/releases.ts",
      );
    }
  }
  return [...releaseData].sort((a, b) => b.releasedAt.localeCompare(a.releasedAt));
}

export function getSkills(): Skills {
  return skillsData;
}

/** Count pills for the tab bar. Only surfaces with real data get a pill. */
export async function getTabCounts(): Promise<{
  issues: number;
  pulls: number;
  commits: number;
  releases: number;
}> {
  const [pulls, issues] = await Promise.all([getAllPullRequests(), getIssues()]);
  return {
    issues: issues.length,
    pulls: pulls.length,
    commits: getCommits().length,
    releases: getReleases().length,
  };
}
