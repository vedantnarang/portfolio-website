import type { CareerCommit } from "@/types/content";

/* Career timeline entries (spec §4) — handoff item 1.
   Hashes are stable display identifiers, not git refs: never regenerate,
   they may end up in URLs. Dates are ISO YYYY-MM-DD; [CONFIRM] values
   carried verbatim from phase3-content-handoff.md pending confirmation.
   The future-dated graduation entry was dropped per decision (handoff §1
   judgment call); the degree can surface via README instead. */
export const commits = [
  {
    hash: "0000000",
    date: "2022-10-03",
    message:
      "init: B.Tech Computer Science and Engineering, Manipal University Jaipur",
    body: "Four years of CS fundamentals — data structures, databases, operating systems, networks. Where the engineering habits started.",
  },
  {
    hash: "4d1a9f2",
    date: "2025-06-02",
    message:
      "feat(career): ERP internship at Walker Chandiok & Co. LLP (Grant Thornton Bharat)",
    body: "Validated end-to-end ERP workflows for 100+ internal users, and traced data flow between the firm's WCGT360 platform and its Salesforce-based client onboarding tools.",
  },
  {
    hash: "8c3e7b1",
    date: "2025-11-20",
    message: "feat: ship flickstat.com to production",
    body: "Built and deployed a football analytics platform on Next.js and Supabase, with Python scrapers on cron continuously harvesting match and player data. First thing I shipped that had real users.",
  },
  {
    hash: "a3f9c21",
    date: "2026-03-02",
    message: "feat(career): join Square Yards as Software Development Intern",
    body: "Frontend delivery on a Next.js SaaS product wrapping AI image generation for interior design workflows — implementing Figma designs to pixel accuracy.",
  },
  {
    hash: "7b2e044",
    date: "2026-08-01",
    message: "feat(career): convert to full-time engineer at Square Yards",
    body: "Moved from frontend delivery onto backend ownership: authentication flows, security for outbound AI API calls, and CDN-backed asset delivery.",
    verified: true,
  },
] satisfies CareerCommit[];
