/* GitHub-style empty state for surfaces whose content ships in later
   phases. Replaced phase-by-phase as real content lands. */
export function EmptyState({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-md border border-dashed border-line px-6 py-20 text-center">
      <span className="text-faint">{icon}</span>
      <h2 className="text-base font-semibold">{title}</h2>
      <p className="max-w-sm text-sm text-muted">{body}</p>
    </div>
  );
}
