import Link from "next/link";
import { RelativeTime } from "@/components/relative-time";
import { DirectoryIcon, FileIcon } from "@/components/icons";

type Row = {
  name: string;
  href: string; // "#about" anchors within home; otherwise internal route
  message: string;
  date: string;
  kind: "dir" | "file";
};

/* Spec §2b — six rows, each linking somewhere real. This is navigation AND
   table of contents. Commit messages/timestamps are presentational content:
   edit freely. */
const ROWS: Row[] = [
  {
    name: "README.md",
    href: "#about",
    message: "docs: who I am and what I build",
    date: "2026-08-22T10:00:00Z",
    kind: "file",
  },
  {
    name: "CONTRIBUTING.md",
    href: "/blob/main/CONTRIBUTING.md",
    message: "docs: how I work with a team",
    date: "2026-07-30T09:00:00Z",
    kind: "file",
  },
  {
    name: "experience/",
    href: "/commits",
    message: "feat: joined Square Yards full-time",
    date: "2026-08-03T09:30:00Z",
    kind: "dir",
  },
  {
    name: "projects/",
    href: "/pulls",
    message: "feat: flickstat goes live",
    date: "2026-08-10T14:00:00Z",
    kind: "dir",
  },
  {
    name: "resume.pdf",
    href: "/releases",
    message: "chore: bump to v2026.08",
    date: "2026-08-22T08:00:00Z",
    kind: "file",
  },
  {
    name: "contact.ts",
    href: "/issues/new",
    message: "feat: add inbound channels",
    date: "2026-08-15T11:20:00Z",
    kind: "file",
  },
];

export function FileTree() {
  return (
    <div className="overflow-hidden rounded-md border border-line">
      <ul className="divide-y divide-line-muted">
        {ROWS.map((row) => {
          const Icon = row.kind === "dir" ? DirectoryIcon : FileIcon;
          const inner = (
            <>
              <span className={row.kind === "dir" ? "text-link" : "text-muted"}>
                <Icon />
              </span>
              <span className="whitespace-nowrap text-sm text-ink hover:text-link hover:underline">
                {row.name}
              </span>
              <span className="ml-2 hidden min-w-0 flex-1 truncate text-sm text-muted md:block">
                {row.message}
              </span>
              <RelativeTime
                date={row.date}
                className="ml-auto whitespace-nowrap text-xs text-muted sm:text-sm"
              />
            </>
          );
          return (
            <li key={row.name} className="transition-colors duration-150 hover:bg-hover">
              {row.href.startsWith("#") ? (
                <a
                  href={row.href}
                  className="flex items-center gap-3 px-4 py-2.5"
                  aria-label={`${row.name} — ${row.message}`}
                >
                  {inner}
                </a>
              ) : (
                <Link
                  href={row.href}
                  className="flex items-center gap-3 px-4 py-2.5"
                  aria-label={`${row.name} — ${row.message}`}
                >
                  {inner}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
