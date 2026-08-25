import type { ComponentType } from "react";

/* ============================================================
   Content model — FROZEN in Phase 1 (PLAN §7.1).
   Additive fields are safe later; renames require editing every
   authored MDX file. Do not rename without migrating all content.
   ============================================================ */

/** A rendered MDX body component (server-compiled at build time). */
export interface MDXContent {
  Component: ComponentType;
}

export type PrState = "open" | "merged" | "draft";

export type LabelKind = "area" | "priority" | "meta";

export interface Label {
  name: string;
  kind: LabelKind;
}

export interface PullRequest {
  id: number;
  title: string;
  state: PrState;
  branch: string;
  labels: Label[];
  commits: number;
  filesChanged: number;
  additions: number;
  deletions: number;
  liveUrl?: string;
  repoUrl?: string;
  lastChecked?: string;
  openedAt?: string;
  mergedAt?: string;
  body: MDXContent;
}

export interface CareerCommit {
  hash: string;
  date: string; // ISO
  message: string;
  body?: string;
  verified?: boolean;
}

export interface Release {
  version: string;
  latest: boolean;
  releasedAt: string; // ISO
  notes: string; // markdown
  pdfPath: string;
  sizeKb: number;
}

export interface Issue {
  id: number;
  title: string;
  labels: Label[];
  pinned?: boolean;
  body: MDXContent;
}

export type LangKey = "ts" | "js" | "py" | "java" | "sql" | "other";

export interface Skills {
  languages: Array<{ name: LangKey; pct: number }>;
  tools: string[];
  topics: string[];
}
