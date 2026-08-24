import Link from "next/link";
import { site, lastUpdated } from "@/data/site";
import { getTabCounts } from "@/lib/content";
import { formatRelativeTime } from "@/components/relative-time";
import { BranchIcon, StarIcon } from "@/components/icons";

/* Repo header chrome (spec §2a): breadcrumb + visibility badge + meta line,
   with the primary Hire CTA and an honest (counter-free) Star link. */
export async function RepoHeader() {
  const counts = await getTabCounts();

  return (
    <header className="bg-inset border-b border-line">
      <div className="mx-auto w-full max-w-[1216px] px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 py-4">
          <div className="flex min-w-0 items-center gap-2 text-lg leading-tight">
            <Link
              href={site.githubProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-link hover:underline"
            >
              {site.owner}
            </Link>
            <span className="text-muted">/</span>
            <Link href="/" className="font-semibold text-link hover:underline">
              {site.repo}
            </Link>
            <span className="ml-1 rounded-full border border-line px-2 py-0.5 text-xs font-medium text-muted">
              {site.visibility}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={site.githubProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-line bg-subtle px-3 py-1.5 text-sm font-medium transition-colors duration-200 hover:bg-hover"
            >
              <StarIcon />
              Star
            </a>
            <Link
              href="/issues/new"
              className="inline-flex items-center rounded-md bg-btn-primary px-3 py-1.5 text-sm font-semibold text-white transition-[filter] duration-200 hover:brightness-110"
            >
              Hire
            </Link>
          </div>
        </div>

        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 pb-3 text-sm text-muted">
          <span className="inline-flex items-center gap-1">
            <BranchIcon />
            {site.defaultBranch} branch
          </span>
          <span aria-hidden>·</span>
          <span>{counts.pulls} pull requests</span>
          <span aria-hidden>·</span>
          <span>Updated {formatRelativeTime(lastUpdated)}</span>
        </p>
      </div>
    </header>
  );
}
