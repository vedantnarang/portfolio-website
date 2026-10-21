import Link from "next/link";
import { site } from "@/data/site";
import { FallbackLinks } from "@/components/contact/fallback-links";

/* GitHub-style quiet footer. Carries the plain contact links on every
   route so reaching out never depends on the /issues/new form. */
export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex w-full max-w-[1216px] flex-col gap-3 px-4 py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          {site.owner}/{site.repo} ·{" "}
          <Link href="/issues/new" className="text-link hover:underline">
            Open an issue
          </Link>{" "}
          ·{" "}
          <Link href="/plain" className="text-link hover:underline">
            Plain view
          </Link>
          <span className="hidden sm:inline">
            {" "}
            · Press{" "}
            <kbd className="rounded border border-line bg-subtle px-1 font-mono">?</kbd> for
            keyboard shortcuts
          </span>
        </p>
        <nav aria-label="Contact">
          <FallbackLinks variant="inline" />
        </nav>
      </div>
    </footer>
  );
}
