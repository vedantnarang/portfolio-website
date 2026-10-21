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
import { commits as commitsData } from "@/data/commits";
import { releases as releasesData } from "@/data/releases";
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

/* ---------- contributing (blob viewer) ---------- */

export interface ContributingView {
  raw: string;
  content: MDXContent;
  lineCount: number;
}

export function getContributingRaw(): string {
  return fs
    .readFileSync(path.join(process.cwd(), "content", "contributing.mdx"), "utf8")
    .replace(/\r\n/g, "\n")
    .trimEnd();
}

export async function getContributing(): Promise<ContributingView> {
  const mod = await import("@/content/contributing.mdx");
  if (typeof mod.default !== "function") {
    throw new ContentError(
      "compiled module has no default component",
      "content/contributing.mdx",
    );
  }
  const raw = getContributingRaw();
  return {
    raw,
    content: { Component: mod.default },
    lineCount: raw.split("\n").length,
  };
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

/** Issue ids from filenames — sync, for generateStaticParams. */
export function getIssueIds(): number[] {
  return issueFiles().map(({ fileId }) => fileId);
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
      return { ...fm, labels: fm.labels.map(toLabel), body } satisfies Issue;
    }),
  );
  return issues.sort((a, b) => {
    if (Boolean(a.pinned) !== Boolean(b.pinned)) return a.pinned ? -1 : 1;
    return b.id - a.id;
  });
}

export async function getIssue(id: number): Promise<Issue | null> {
  const all = await getIssues();
  return all.find((issue) => issue.id === id) ?? null;
}

/* ---------- commits ---------- */

const HASH_RE = /^[0-9a-f]{7}$/;

/** Newest first. Validates hashes (7 hex, unique) and dates at build. */
export function getCommits(): CareerCommit[] {
  const seen = new Set<string>();
  for (const c of commitsData) {
    const source = `data/commits.ts (${c.hash})`;
    if (!HASH_RE.test(c.hash)) {
      throw new ContentError("hash must be 7 lowercase hex characters", source);
    }
    if (seen.has(c.hash)) throw new ContentError("duplicate hash", source);
    seen.add(c.hash);
    if (Number.isNaN(Date.parse(c.date))) {
      throw new ContentError(`invalid date "${c.date}"`, source);
    }
  }
  return [...commitsData].sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
}

/* ---------- releases ---------- */

/** v2026.08 → /resume/vedant-narang-resume-2026-08.pdf (handoff §5). */
export function resumePathFor(version: string): string {
  return `/resume/vedant-narang-resume-${version.slice(1).replace(".", "-")}.pdf`;
}

/** Newest first. The PDF is derived from the version and measured on
   disk, so a missing file hides the attachment instead of shipping a
   404 — and warns loudly at build. */
export function getReleases(): Release[] {
  const latest = releasesData.filter((r) => r.latest);
  if (latest.length !== 1) {
    throw new ContentError(
      `exactly one release must be latest (found ${latest.length})`,
      "data/releases.ts",
    );
  }
  return releasesData
    .map((r) => {
      const pdfPath = resumePathFor(r.version);
      const file = path.join(process.cwd(), "public", pdfPath);
      if (!fs.existsSync(file)) {
        if (r.latest) {
          console.warn(
            `[data/releases.ts] latest release ${r.version} has no PDF at public${pdfPath}`,
          );
        }
        return { ...r };
      }
      const sizeKb = Math.round(fs.statSync(file).size / 1024);
      return { ...r, pdfPath, sizeKb };
    })
    .sort((a, b) => Date.parse(b.releasedAt) - Date.parse(a.releasedAt));
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
  return {
    issues: getIssueIds().length,
    pulls: getPullIds().length,
    commits: commitsData.length,
    releases: releasesData.length,
  };
}
