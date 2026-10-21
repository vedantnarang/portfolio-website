import type { CareerCommit } from "@/types/content";

/* Career timeline as commit history (spec §4). Hashes are invented but
   STABLE — never regenerate them; they may end up in URLs. Order here
   doesn't matter: lib/content sorts newest-first.
   TODO(vedant): confirm the dates marked [CONFIRM] (phase-3 handoff §1). */
export const commits: CareerCommit[] = [
  {
    hash: "0000000",
    date: "2022-10-03",
    message: "init: B.Tech Computer Science and Engineering, Manipal University Jaipur",
    body: "Four years of CS fundamentals — data structures, databases, operating systems, networks. Where the engineering habits started.",
  },
  {
    hash: "4d1a9f2",
    date: "2025-06-02",
    message: "feat(career): ERP internship at Walker Chandiok & Co. LLP (Grant Thornton Bharat)",
    body: "Validated end-to-end ERP workflows for 100+ internal users, and traced data flow between the firm's WCGT360 platform and its Salesforce-based client onboarding tools.",
  },
  {
    hash: "8c3e7b1",
    date: "2025-11-20", // [CONFIRM] first production deploy of flickstat.com
    message: "feat: ship flickstat.com to production",
    body: "Built with Arnav Gupta and Mohammed Azeem; I led the identity-normalization design. A football analytics platform on Next.js and Supabase, with Python scrapers on cron continuously harvesting match and player data. First thing I shipped that had real users.",
  },
  {
    hash: "a3f9c21",
    date: "2026-03-02", // [CONFIRM] start date
    message: "feat(career): join Square Yards as Software Development Intern",
    body: "Frontend delivery on a Next.js SaaS product wrapping AI image generation for interior design workflows — implementing Figma designs to pixel accuracy.",
  },
  {
    hash: "7b2e044",
    date: "2026-08-01", // [CONFIRM] full-time conversion date
    message: "feat(career): convert to full-time engineer at Square Yards",
    body: "Moved from frontend delivery onto backend ownership: authentication flows, security for outbound AI API calls, and CDN-backed asset delivery.",
    verified: true,
  },
  {
    hash: "f2b8d05",
    date: "2026-10-15", // [CONFIRM] graduation date
    message: "chore: complete B.Tech, Manipal University Jaipur",
    body: "Degree finished while working full-time.",
  },
];
