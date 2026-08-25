import type { Label } from "@/types/content";

/* Label pill styling per design.md §2 labels map:
   area chips (backend/frontend/…) = subtle outline pills;
   meta/priority kinds inherit tinted treatments as they appear. */
const KIND_CLASS: Record<Label["kind"], string> = {
  area: "border border-line bg-subtle text-muted",
  meta: "bg-link-tint text-link",
  priority: "border border-line text-muted",
};

export function LabelPill({ name, kind }: Label) {
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium leading-4 ${KIND_CLASS[kind]}`}
    >
      {name}
    </span>
  );
}
