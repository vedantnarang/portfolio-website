import type { Label } from "@/types/content";

/* Label pill styling per design.md §2 labels map. Named labels carry
   their own tint; anything else falls back to its kind:
   area chips = subtle outline · priority = transparent outline ·
   meta = accent tint. */
const KIND_CLASS: Record<Label["kind"], string> = {
  area: "border border-line bg-subtle text-muted",
  meta: "bg-link-tint text-link",
  priority: "border border-line text-muted",
};

const NAME_CLASS: Record<string, string> = {
  enhancement: "bg-success-tint text-success",
  "help wanted": "bg-success-tint text-success",
  "good first issue": "bg-success-tint text-success",
  "tech-debt": "bg-warn-tint text-warn",
  learning: "bg-link-tint text-link",
  question: "bg-link-tint text-link",
};

export function LabelPill({ name, kind }: Label) {
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium leading-4 ${NAME_CLASS[name] ?? KIND_CLASS[kind]}`}
    >
      {name}
    </span>
  );
}
