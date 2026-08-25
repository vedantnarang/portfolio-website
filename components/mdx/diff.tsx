import { highlightLines } from "@/lib/shiki";

/* ============================================================
   GitHub-style diff block for PR bodies (spec §11 MDX contract).

   <Diff file="lib/normalize.ts" lang="ts" additions={18} deletions={4}>
   {`
   @@ src/scrapers
   -old line
   +new line
    context
   `}
   </Diff>

   Line prefixes classify rows: `+` add · `-` delete · `@@` hunk ·
   otherwise context. Both layouts render server-side; CSS picks
   split (≥768px) or unified (<768px) — zero JS (spec §10).
   Word-level highlights are a later refinement; glyphs carry the
   colorblind-safe signal today (design.md §2).
   ============================================================ */

type LineType = "add" | "del" | "hunk" | "ctx";

interface Line {
  type: LineType;
  /** Code text with the classification marker stripped. */
  text: string;
}

function parseLines(raw: string): Line[] {
  return raw
    .replace(/\r\n/g, "\n")
    .replace(/\n$/, "")
    .split("\n")
    .map((line) => {
      if (line.startsWith("@@")) return { type: "hunk" as const, text: line };
      if (line.startsWith("+")) return { type: "add" as const, text: line.slice(1) };
      if (line.startsWith("-")) return { type: "del" as const, text: line.slice(1) };
      if (line.startsWith(" ")) return { type: "ctx" as const, text: line.slice(1) };
      return { type: "ctx" as const, text: line };
    });
}

/** Flatten MDX children into the raw code string (template-literal child,
   or text recovered from an accidental fenced <pre><code>). */
function extractCode(children: React.ReactNode): string {
  const parts: string[] = [];
  const walk = (node: React.ReactNode): void => {
    if (node == null || typeof node === "boolean") return;
    if (typeof node === "string" || typeof node === "number") {
      parts.push(String(node));
      return;
    }
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    const props = (node as { props?: { children?: React.ReactNode } }).props;
    if (props?.children !== undefined) walk(props.children);
  };
  walk(children);
  return parts.join("");
}

/** Pair del/add runs index-wise so the split view lines up old vs new. */
interface Row {
  line: Line;
  tokens: Array<{ content: string; style?: Record<string, string> }>;
}

interface SplitRow {
  old?: Row;
  new?: Row;
}

function toSplitRows(rows: Row[]): SplitRow[] {
  const out: SplitRow[] = [];
  let i = 0;
  while (i < rows.length) {
    const row = rows[i];
    if (row.line.type === "hunk" || row.line.type === "ctx") {
      out.push(
        row.line.type === "ctx"
          ? { old: row, new: row }
          : { old: row }, // hunk marker rides the old slot; rendered full-width
      );
      i += 1;
      continue;
    }
    const dels: Row[] = [];
    const adds: Row[] = [];
    while (i < rows.length && rows[i].line.type === "del") dels.push(rows[i++]);
    while (i < rows.length && rows[i].line.type === "add") adds.push(rows[i++]);
    const pairs = Math.max(dels.length, adds.length);
    for (let p = 0; p < pairs; p += 1) {
      out.push({ old: dels[p], new: adds[p] });
    }
  }
  return out;
}

const GLYPH: Record<LineType, string> = {
  add: "+",
  del: "\u2212",
  hunk: "",
  ctx: "\u00A0",
};

const LINE_BG: Record<LineType, string> = {
  add: "bg-diff-add-line",
  del: "bg-diff-del-line",
  ctx: "",
  hunk: "bg-diff-hunk",
};

const GLYPH_COLOR: Record<LineType, string> = {
  add: "text-success",
  del: "text-danger",
  ctx: "text-faint",
  hunk: "",
};

function TokenSpans({
  tokens,
}: {
  tokens: Array<{ content: string; style?: Record<string, string> }>;
}) {
  return (
    <>
      {tokens.map((token, i) => (
        <span key={i} className="_st" style={token.style}>
          {token.content}
        </span>
      ))}
    </>
  );
}

function CodeCell({ row }: { row: Row }) {
  const t = row.line.type;
  return (
    <div className={`flex ${LINE_BG[t]}`}>
      <span
        aria-hidden
        className={`w-8 shrink-0 select-none border-r border-line-muted pr-2 text-right font-mono text-xs leading-6 ${GLYPH_COLOR[t]}`}
      >
        {GLYPH[t]}
      </span>
      <code className="block min-w-0 overflow-x-auto whitespace-pre px-3 font-mono text-xs leading-6 text-ink">
        <TokenSpans tokens={row.tokens} />
      </code>
    </div>
  );
}

export async function Diff({
  file,
  additions,
  deletions,
  lang = "ts",
  children,
}: {
  file: string;
  additions?: number;
  deletions?: number;
  lang?: string;
  children?: React.ReactNode;
}) {
  const code = extractCode(children);
  const lines = parseLines(code);
  const highlighted = await highlightLines(
    lines.map((l) => l.text).join("\n"),
    lang,
  );

  // Shiki returns one entry per input line — zip back onto typed lines.
  const rows: Row[] = lines.map((line, idx) => ({
    line,
    tokens: highlighted[idx] ?? [{ content: line.text }],
  }));
  const splitRows = toSplitRows(rows);

  return (
    <figure className="my-6 overflow-hidden rounded-md border border-line">
      <figcaption className="flex items-center justify-between gap-4 bg-subtle px-4 py-2 font-mono text-xs">
        <span className="min-w-0 truncate text-ink">{file}</span>
        {(additions !== undefined || deletions !== undefined) && (
          <span className="shrink-0">
            {additions !== undefined && (
              <span className="text-success">+{additions}</span>
            )}{" "}
            {deletions !== undefined && (
              <span className="text-danger">{"\u2212"}{deletions}</span>
            )}
          </span>
        )}
      </figcaption>

      {/* Unified — below 768px */}
      <div className="md:hidden">
        {rows.map((row, i) =>
          row.line.type === "hunk" ? (
            <div
              key={i}
              className={`px-4 py-1 font-mono text-xs leading-6 text-link ${LINE_BG.hunk}`}
            >
              {row.line.text}
            </div>
          ) : (
            <CodeCell key={i} row={row} />
          ),
        )}
      </div>

      {/* Split — 768px and up */}
      <div className="hidden md:block">
        <div className="grid grid-cols-2 gap-px bg-line-muted">
          {splitRows.map((row, i) => (
            <SplitPair key={i} row={row} />
          ))}
        </div>
      </div>
    </figure>
  );
}

function SplitPair({ row }: { row: SplitRow }) {
  // Hunk headers span both columns.
  if (row.old && row.old.line.type === "hunk") {
    return (
      <div
        className={`col-span-2 px-4 py-1 font-mono text-xs leading-6 text-link ${LINE_BG.hunk}`}
      >
        {row.old.line.text}
      </div>
    );
  }
  return (
    <>
      {row.old ? <CodeCell row={row.old} /> : <div className="bg-subtle" aria-hidden />}
      {row.new ? <CodeCell row={row.new} /> : <div className="bg-subtle" aria-hidden />}
    </>
  );
}
