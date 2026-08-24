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
import {
  ContentError,
  loadFrontmatter,
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

/* ---------- issues / commits / releases (Phase 3 fills these) ---------- */

export function getIssues(): Issue[] {
  // Implemented in Phase 3 alongside app/issues/[id]; kept here so callers
  // can be wired once.
  void ISSUE_DIR;
  return [];
}

export function getCommits(): CareerCommit[] {
  // Phase 3: reads data/commits.ts
  return [];
}

export function getReleases(): Release[] {
  // Phase 3: reads data/releases.ts
  return [];
}

export function getSkills(): Skills {
  return skillsData;
}

/** Count pills for the tab bar. Only surfaces with real data get a pill;
   Phase 3 wires the remaining loaders in and the pills appear. */
export async function getTabCounts(): Promise<{
  issues: number;
  pulls: number;
  commits: number;
  releases: number;
}> {
  const [pulls] = await Promise.all([getAllPullRequests()]);
  return {
    issues: getIssues().length,
    pulls: pulls.length,
    commits: getCommits().length,
    releases: getReleases().length,
  };
}
