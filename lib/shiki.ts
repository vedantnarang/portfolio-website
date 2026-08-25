import { createHighlighter, type Highlighter } from "shiki";

/* ============================================================
   Server-only Shiki singleton. Dual Primer themes emit CSS
   variables (--shiki-light / --shiki-dark); globals.css swaps
   them under `.dark`, so highlighted output is theme-correct
   with zero client JS. Never import this from a client module.
   ============================================================ */

const THEMES = { light: "github-light", dark: "github-dark" } as const;

/** Languages pre-loaded at build time — extend as content grows. */
const SUPPORTED = [
  "typescript",
  "tsx",
  "javascript",
  "jsx",
  "python",
  "sql",
  "json",
  "bash",
  "yaml",
  "dockerfile",
] as const;

export type SupportedLang = (typeof SUPPORTED)[number];

const ALIASES: Record<string, SupportedLang> = {
  ts: "typescript",
  typescript: "typescript",
  tsx: "tsx",
  js: "javascript",
  javascript: "javascript",
  jsx: "jsx",
  mjs: "javascript",
  py: "python",
  python: "python",
  sql: "sql",
  json: "json",
  bash: "bash",
  sh: "bash",
  shell: "bash",
  yaml: "yaml",
  yml: "yaml",
  dockerfile: "dockerfile",
};

let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter(): Promise<Highlighter> {
  highlighterPromise ??= createHighlighter({
    themes: [THEMES.light, THEMES.dark],
    langs: [...SUPPORTED],
  });
  return highlighterPromise;
}

export interface Token {
  content: string;
  /** Inline CSS variables consumed by the .shiki-token CSS bridge. */
  style?: Record<"--shiki-light" | "--shiki-dark", string>;
}

/** One line of highlighted output = ordered token list. */
export type HighlightedLine = Token[];

export async function highlightLines(
  code: string,
  lang: string,
): Promise<HighlightedLine[]> {
  const normalized = ALIASES[lang.trim().toLowerCase()];
  if (!normalized || code.length === 0) {
    // Plain passthrough keeps unknown languages readable instead of failing.
    return code.split("\n").map((line) => [{ content: line }]);
  }

  const highlighter = await getHighlighter();
  const result = highlighter.codeToTokens(code, {
    lang: normalized,
    themes: THEMES,
    defaultColor: false,
  });

  return result.tokens.map((lineTokens) =>
    lineTokens.map((token) => ({
      content: token.content,
      style: token.htmlStyle as Token["style"],
    })),
  );
}
