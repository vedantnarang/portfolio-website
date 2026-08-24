import type { Skills } from "@/types/content";

/* Spec §2d — language bar forces honest weighting. Percentages must sum
   to ~100 and match the Linguist brand colors in globals.css (bg-lang-*). */
export const skills: Skills = {
  languages: [
    { name: "ts", pct: 41.2 },
    { name: "js", pct: 22.8 },
    { name: "py", pct: 14.6 },
    { name: "java", pct: 11.1 },
    { name: "sql", pct: 7.3 },
    { name: "other", pct: 3.0 },
  ],
  tools: ["Docker", "Git", "Vercel", "AWS", "Power BI"],
  topics: [
    "nodejs",
    "typescript",
    "nextjs",
    "postgres",
    "docker",
    "aws",
    "system-design",
  ],
};

export const langNames: Record<Skills["languages"][number]["name"], string> = {
  ts: "TypeScript",
  js: "JavaScript",
  py: "Python",
  java: "Java",
  sql: "SQL",
  other: "Other",
};
