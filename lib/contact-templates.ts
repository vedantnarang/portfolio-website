export type TemplateKind = "job" | "collab" | "hello";

export interface ContactTemplate {
  kind: TemplateKind;
  emoji: string;
  name: string;
  label: string;
  description: string;
  body: string;
}

export const CONTACT_TEMPLATES: ContactTemplate[] = [
  {
    kind: "job",
    emoji: "🐛",
    name: "Job opportunity",
    label: "enhancement",
    description:
      "Recruiters and hiring managers — open roles, teams, and stacks.",
    body: `### Role

<!-- title, level, team -->

### Stack

### Location & arrangement

### How can I reach you back?

`,
  },
  {
    kind: "collab",
    emoji: "💬",
    name: "Collaboration / freelance",
    label: "question",
    description: "Founders and other developers — projects and side quests.",
    body: `### What are you building?

### Where would I fit in?

### How can I reach you back?

`,
  },
  {
    kind: "hello",
    emoji: "⭐",
    name: "Just saying hi",
    label: "good first issue",
    description: "Everyone else — questions, feedback, or a plain hello.",
    body: `### Say hello

`,
  },
];

export function getTemplate(kind: string): ContactTemplate | undefined {
  return CONTACT_TEMPLATES.find((t) => t.kind === kind);
}
