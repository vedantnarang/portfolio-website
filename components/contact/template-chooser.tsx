"use client";

import type { ContactTemplate, TemplateKind } from "@/lib/contact-templates";
import { LabelPill } from "@/components/label-pill";

/* GitHub's issue-template chooser (PLAN Phase 4): three cards that stack
   under 520px. Native radios carry the `template` field, so arrow-key
   selection and no-JS submission come for free; with JS, selection also
   pre-fills the body inside the form. */
export function TemplateChooser({
  templates,
  selected,
  onSelect,
  errorId,
  disabled,
}: {
  templates: ContactTemplate[];
  selected: TemplateKind | null;
  onSelect: (template: ContactTemplate) => void;
  errorId?: string;
  disabled?: boolean;
}) {
  return (
    <fieldset
      className="min-w-0"
      aria-describedby={errorId}
      aria-invalid={errorId ? true : undefined}
      disabled={disabled}
    >
      <legend className="mb-2 text-sm font-semibold">Choose a template</legend>
      <div className="grid grid-cols-1 gap-3 min-[520px]:grid-cols-3">
        {templates.map((template) => (
          <label
            key={template.kind}
            className="cursor-pointer rounded-md border border-line bg-subtle p-3 transition-colors duration-150 hover:bg-hover has-[:checked]:border-accent-emphasis has-[:checked]:bg-link-tint has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-link"
          >
            <input
              type="radio"
              name="template"
              value={template.kind}
              required
              checked={template.kind === selected}
              onChange={() => onSelect(template)}
              className="sr-only"
            />
            <span className="mb-1 flex items-center gap-2 text-sm font-semibold text-ink">
              <span aria-hidden>{template.emoji}</span>
              {template.name}
            </span>
            <span className="block text-xs leading-5 text-muted">
              {template.description}
            </span>
            <span className="mt-2 block">
              <LabelPill name={template.label} kind="meta" />
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
