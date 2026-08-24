import Link from "next/link";
import { getTabCounts } from "@/lib/content";
import {
  CodeIcon,
  GitCommitIcon,
  GitPullRequestIcon,
  IssueOpenedIcon,
  TagIcon,
} from "@/components/icons";

const TABS = [
  { key: "code", label: "Code", href: "/", icon: CodeIcon },
  { key: "issues", label: "Issues", href: "/issues", icon: IssueOpenedIcon },
  {
    key: "pulls",
    label: "Pull requests",
    href: "/pulls",
    icon: GitPullRequestIcon,
  },
  { key: "commits", label: "Commits", href: "/commits", icon: GitCommitIcon },
  { key: "releases", label: "Releases", href: "/releases", icon: TagIcon },
] as const;

export type TabKey = (typeof TABS)[number]["key"];

const COUNT_KEYS = { issues: true, pulls: true, commits: true, releases: true };

/* Server component — active state is passed by the section layout, so no
   client JS and no hydration cost (PLAN §7.5 zero-client rule). */
export async function TabBar({ active }: { active: TabKey }) {
  const counts = await getTabCounts();

  return (
    <nav aria-label="Repository" className="-mb-px flex gap-1 overflow-x-auto">
      {TABS.map((tab) => {
        const isActive = tab.key === active;
        const count =
          tab.key in COUNT_KEYS ? counts[tab.key as keyof typeof counts] : undefined;
        const Icon = tab.icon;
        return (
          <Link
            key={tab.key}
            href={tab.href}
            aria-current={isActive ? "page" : undefined}
            className={`flex items-center gap-2 whitespace-nowrap rounded-t-md border-b-2 px-3 py-2 text-sm transition-colors duration-200 ${
              isActive
                ? "border-link font-semibold text-ink"
                : "border-transparent text-muted hover:border-line-muted hover:bg-hover"
            }`}
          >
            <span className={isActive ? "text-ink" : "text-muted"}>
              <Icon />
            </span>
            {tab.label}
            {count !== undefined && count > 0 && (
              <span className="rounded-full bg-hover px-1.5 py-0.5 text-xs font-medium leading-none text-ink">
                {count}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
