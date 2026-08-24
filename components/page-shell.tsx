/* GitHub-style centered frame: max-width container with subtle border-x
   (PLAN Phase 1 component table). All page content lives inside it. */
export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[1216px] flex-1 border-x border-line-muted px-4 sm:px-6">
      {children}
    </div>
  );
}
