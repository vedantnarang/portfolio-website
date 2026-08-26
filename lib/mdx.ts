import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { PrState } from "@/types/content";

/* ============================================================
   Server-only MDX loading: raw file read + frontmatter extraction
   + hand-rolled validation. Body components are compiled by
   @next/mdx at build time and pulled in via dynamic import in
   lib/content.ts — this module never crosses into the client.
   ============================================================ */

const CONTENT_DIR = path.join(process.cwd(), "content");

export class ContentError extends Error {
  constructor(
    message: string,
    public readonly source: string,
  ) {
    super(`[${source}] ${message}`);
    this.name = "ContentError";
  }
}

function readRaw(relPath: string): string {
  const full = path.join(CONTENT_DIR, relPath);
  if (!fs.existsSync(full)) {
    throw new ContentError("file does not exist", relPath);
  }
  return fs.readFileSync(full, "utf8");
}

/** Parse YAML frontmatter off an MDX file and validate it with `fn`. */
export function loadFrontmatter<T>(
  relPath: string,
  validate: (data: Record<string, unknown>) => T,
): T {
  const raw = readRaw(relPath);
  const parsed = matter(raw);
  try {
    return validate(parsed.data as Record<string, unknown>);
  } catch (err) {
    throw new ContentError(
      err instanceof Error ? err.message : String(err),
      relPath,
    );
  }
}

/* ---------- validation primitives (descriptive failures) ---------- */

type Data = Record<string, unknown>;

function reqString(data: Data, key: string): string {
  const v = data[key];
  if (typeof v !== "string" || v.trim() === "") {
    throw new Error(`frontmatter.${key} must be a non-empty string`);
  }
  return v;
}

function reqNumber(data: Data, key: string): number {
  const v = data[key];
  if (typeof v !== "number" || !Number.isFinite(v)) {
    throw new Error(`frontmatter.${key} must be a finite number`);
  }
  return v;
}

function reqEnum<T extends string>(data: Data, key: string, values: readonly T[]): T {
  const v = data[key];
  if (typeof v !== "string" || !values.includes(v as T)) {
    throw new Error(
      `frontmatter.${key} must be one of: ${values.join(" | ")} (got ${JSON.stringify(v)})`,
    );
  }
  return v as T;
}

function optString(data: Data, key: string): string | undefined {
  const v = data[key];
  if (v === undefined || v === null) return undefined;
  if (typeof v !== "string" || v.trim() === "") return undefined;
  return v;
}

function reqStringArray(data: Data, key: string): string[] {
  const v = data[key];
  if (v === undefined || v === null) return [];
  if (
    !Array.isArray(v) ||
    v.some((item) => typeof item !== "string" || item.trim() === "")
  ) {
    throw new Error(`frontmatter.${key} must be an array of non-empty strings`);
  }
  return v as string[];
}

/* ---------- domain-specific validation ---------- */

const PR_STATES = ["open", "merged", "draft"] as const;

export interface PullFrontmatter {
  id: number;
  title: string;
  state: PrState;
  branch: string;
  labels: string[];
  commits: number;
  filesChanged: number;
  additions: number;
  deletions: number;
  liveUrl?: string;
  repoUrl?: string;
  lastChecked?: string;
  openedAt?: string;
  mergedAt?: string;
}

/** Validate PR frontmatter; `fileId` comes from the filename prefix. */
export function validatePullFrontmatter(data: Data, fileId: number): PullFrontmatter {
  const id = reqNumber(data, "id");
  if (!Number.isInteger(id)) throw new Error("frontmatter.id must be an integer");
  if (id !== fileId) {
    throw new Error(
      `frontmatter.id (${id}) must match filename prefix (${fileId})`,
    );
  }
  const state = reqEnum(data, "state", PR_STATES);
  return {
    id,
    title: reqString(data, "title"),
    state,
    branch: reqString(data, "branch"),
    labels: reqStringArray(data, "labels"),
    commits: reqNumber(data, "commits"),
    filesChanged: reqNumber(data, "filesChanged"),
    additions: reqNumber(data, "additions"),
    deletions: reqNumber(data, "deletions"),
    liveUrl: optString(data, "liveUrl"),
    repoUrl: optString(data, "repoUrl"),
    lastChecked: optString(data, "lastChecked"),
    openedAt: optString(data, "openedAt"),
    mergedAt: optString(data, "mergedAt"),
  };
}

export interface IssueFrontmatter {
  id: number;
  title: string;
  labels: string[];
  pinned?: boolean;
}

/** Validate issue frontmatter; same filename-prefix contract as PRs. */
export function validateIssueFrontmatter(data: Data, fileId: number): IssueFrontmatter {
  const id = reqNumber(data, "id");
  if (!Number.isInteger(id)) throw new Error("frontmatter.id must be an integer");
  if (id !== fileId) {
    throw new Error(
      `frontmatter.id (${id}) must match filename prefix (${fileId})`,
    );
  }
  return {
    id,
    title: reqString(data, "title"),
    labels: reqStringArray(data, "labels"),
    pinned: data.pinned === undefined ? undefined : Boolean(data.pinned),
  };
}
