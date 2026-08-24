import type { LangKey, Skills } from "@/types/content";
import { langNames } from "@/data/skills";

const LANG_CLASS: Record<LangKey, string> = {
  ts: "bg-lang-ts",
  js: "bg-lang-js",
  py: "bg-lang-py",
  java: "bg-lang-java",
  sql: "bg-lang-sql",
  other: "bg-lang-other",
};

/* GitHub Linguist strip — fixed brand colors in both modes (design.md §2).
   Segment widths come straight from skills data; percentages must sum to
   ~100 (acceptance gate). */
export function LanguageBar({ languages }: { languages: Skills["languages"] }) {
  return (
    <div>
      <div
        role="img"
        aria-label="Language distribution"
        className="flex h-2 overflow-hidden rounded-full"
      >
        {languages.map((lang) => (
          <span
            key={lang.name}
            className={LANG_CLASS[lang.name]}
            style={{ width: `${lang.pct}%` }}
          />
        ))}
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs">
        {languages.map((lang) => (
          <li key={lang.name} className="flex items-center gap-1.5">
            <span
              className={`size-2 rounded-full ${LANG_CLASS[lang.name]}`}
              aria-hidden
            />
            <span className="font-medium text-ink">{langNames[lang.name]}</span>
            <span className="text-muted">{lang.pct.toFixed(1)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
