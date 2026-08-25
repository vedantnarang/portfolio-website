import { site } from "@/data/site";

/* ============================================================
   Review thread card (spec §11 MDX contract):

   <Review author="reviewer" q="Why X instead of Y?">
   Body answering the question.
   </Review>

   Typographic only (Phase 2 out-of-scope: avatars/images).
   Thread reads through a left border like a comment chain.
   ============================================================ */

export function Review({
  author,
  q,
  children,
}: {
  author: "vedantnarang" | "reviewer";
  q?: string;
  children?: React.ReactNode;
}) {
  const isOwner = author === "vedantnarang";
  return (
    <div className="my-4 rounded-md border border-line">
      {q && (
        <p className="border-b border-line-muted bg-subtle px-4 py-2.5 text-sm font-medium">
          {q}
        </p>
      )}
      <div className="flex gap-3 p-4">
        {/* Thread spine */}
        <span
          aria-hidden
          className={`w-0.5 shrink-0 self-stretch ${isOwner ? "bg-success" : "bg-neutral"}`}
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">
            {isOwner ? site.owner : "reviewer"}
            {!isOwner && (
              <span className="ml-1.5 rounded-full border border-line px-1.5 py-px text-[10px] font-medium uppercase tracking-wide text-muted">
                review
              </span>
            )}
          </p>
          <div className="mt-1.5 text-sm leading-6 text-muted">{children}</div>
        </div>
      </div>
    </div>
  );
}
