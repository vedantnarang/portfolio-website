/* Résumé versions (spec §7). The PDF for each release is NOT listed here:
   lib/content derives it from the version (v2026.08 →
   public/resume/vedant-narang-resume-2026-08.pdf) and measures its size,
   so filename and version can never drift apart. Releases without a PDF
   on disk simply render without an attachment row.
   Exactly one entry may be `latest: true` — enforced at build. */
export interface ReleaseEntry {
  version: `v${number}.${string}`;
  latest: boolean;
  releasedAt: string; // ISO date
  notes: string; // markdown
}

export const releases: ReleaseEntry[] = [
  {
    version: "v2026.08",
    latest: true,
    // Handoff draft said 2026-07-05, which predates the August conversion
    // it describes; aligned with the file tree's "bump to v2026.08" row.
    releasedAt: "2026-08-22", // [CONFIRM]
    notes: `## Changed
- Square Yards: Software Development Intern → full-time engineer
- Scope shifted from frontend delivery to backend ownership — auth flows, outbound API security, CDN asset pipeline
- Added Flickstat to projects; now serving live users at flickstat.com
- Summary rewritten around backend and infrastructure rather than "MERN stack"

## Removed
- Higher secondary education section`,
  },
  {
    version: "v2026.03",
    latest: false,
    releasedAt: "2026-03-05", // [CONFIRM]
    notes: `## Added
- Square Yards internship — Next.js and Node.js, AI image generation SaaS
- AI Study Buddy and Shared Wallet to projects
- TypeScript and Supabase to skills

## Changed
- Reordered projects to lead with production work rather than coursework`,
  },
  {
    version: "v2025.07",
    latest: false,
    releasedAt: "2025-07-31", // [CONFIRM]
    notes: `## Added
- Grant Thornton Bharat ERP internship — first professional experience
- Power BI and Excel under platforms

First version with any real experience section.`,
  },
];
