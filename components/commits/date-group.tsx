/* Sticky month separator, GitHub commit-history style. Pinned just below
   the tab bar (RepoChrome pins its tab row at top-0 z-20 with a 37px total
   height) and slides beneath it while scrolling thanks to the lower
   z-index. If that height ever changes in repo-chrome.tsx, update top here. */
export function DateGroupHeader({ label }: { label: string }) {
  return (
    <h2 className="sticky top-[37px] z-10 border-b border-line-muted bg-canvas px-4 py-2 text-sm font-semibold text-ink">
      {label}
    </h2>
  );
}
