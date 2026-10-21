/* GitHub's "Verified" pill, reused to mark the current role (spec §4).
   Tooltip via `title` — deliberately simple (PLAN Phase 3 §5). */
export function VerifiedBadge() {
  return (
    <span
      title="Current role"
      className="inline-flex items-center rounded-full border border-success px-2 py-px text-xs font-medium leading-4 text-success"
    >
      Verified
    </span>
  );
}
