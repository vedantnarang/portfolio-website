import { VerifiedIcon } from "@/components/icons";

/* GitHub-style "Verified" marker for the current-role commit (spec §4).
   Tooltip via title only — kept deliberately simple (PLAN Phase 3 §5). */
export function VerifiedBadge({ className = "" }: { className?: string }) {
  return (
    <span
      title="Verified — this is my current role"
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-md border border-line px-1.5 py-0.5 text-xs font-medium leading-4 text-success ${className}`}
    >
      <VerifiedIcon />
      Verified
    </span>
  );
}
