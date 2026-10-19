"use client";

import type { ContactTemplate, TemplateKind } from "@/lib/contact-templates";
import { LabelPill } from "@/components/label-pill";

/* GitHub's issue-template chooser (PLAN Phase 4): three cards that stack
   under 520px. Selection feeds the hidden `template` field and pre-fills
   the body inside the form — no separate route needed at this scale. */
export function TemplateChooser({
  templates,
  selected,
  onSelect,
}: {
  templates: ContactTemplate[];
  selected: TemplateKind | null;
  onSelect: (template: ContactTemplate) => void;
}) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-2 text-sm font-semibold">Choose a template</legend>
      <div className="grid grid-cols-1 gap-3 min-[520px]:grid-cols-3">
        {templates.map((template) => {
          const isActive = template.kind === selected;
          return (
            <button
              key={template.kind}
              type="button"
              aria-pressed={isActive}
              onClick={() => onSelect(template)}
              className={`cursor-pointer rounded-md border p-3 text-left transition-colors duration-150 ${
                isActive
                  ? "border-accent-emphasis bg-link-tint hover:bg-link-tint"
                  : "border-line bg-subtle hover:bg-hover"
              }`}
            >
              <p className="mb-1 flex items-center gap-2 text-sm font-semibold text-ink">
                <span aria-hidden>{template.emoji}</span>
                {template.name}
              </p>
              <p className="text-xs leading-5 text-muted">
                {template.description}
              </p>
              <p className="mt-2">
                <LabelPill name={template.label} kind="meta" />
              </p>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
