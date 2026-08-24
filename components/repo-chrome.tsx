import { RepoHeader } from "@/components/repo-header";
import { TabBar, type TabKey } from "@/components/tab-bar";

/* Shared repo chrome for every route: header + always-visible tab bar.
   The tab row is sticky (top-0) so navigation stays reachable; the tall
   header scrolls away like GitHub's own repo page. */
export function RepoChrome({
  active,
  children,
}: {
  active: TabKey;
  children: React.ReactNode;
}) {
  return (
    <>
      <RepoHeader />
      <div className="sticky top-0 z-20 border-b border-line bg-canvas">
        <div className="mx-auto w-full max-w-[1216px] px-4 sm:px-6">
          <TabBar active={active} />
        </div>
      </div>
      {children}
    </>
  );
}
