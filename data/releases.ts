import type { Release } from "@/types/content";

/* Résumé releases (spec §7) — handoff item 3.
   Invariants enforced by getReleases() at build time:
   - exactly one latest: true
   - the latest release's pdfPath must exist under public/
   Historical entries carry no binary (pdfPath omitted) — the current PDF
   is the only artifact we serve, so older tags render notes only rather
   than pointing at a file that misrepresents their changelog. */
export const releases = [
  {
    version: "v2026.08",
    latest: true,
    releasedAt: "2026-08-01",
    notes: `- Square Yards: Software Development Intern → full-time engineer
- Scope shifted from frontend delivery to backend ownership — auth flows, outbound API security, CDN asset pipeline
- Added Flickstat to projects; now serving live users at flickstat.com
- Summary rewritten around backend and infrastructure rather than "MERN stack"
- Removed higher secondary education section`,
    pdfPath: "/resume/vedant-narang-resume-2026-08.pdf",
    sizeKb: 104,
  },
  {
    version: "v2026.03",
    latest: false,
    releasedAt: "2026-03-02",
    notes: `- Added Square Yards internship — Next.js and Node.js, AI image generation SaaS
- Added AI Study Buddy and Shared Wallet to projects
- Added TypeScript and Supabase to skills
- Reordered projects to lead with production work rather than coursework`,
  },
  {
    version: "v2025.07",
    latest: false,
    releasedAt: "2025-07-31",
    notes: `- Added Grant Thornton Bharat ERP internship — first professional experience
- Added Power BI and Excel under platforms
- First version with any real experience section`,
  },
] satisfies Release[];
