/* Site-level personal configuration. Edit these values — they feed
   RepoHeader, SidebarAbout, and later phases (contact fallbacks, SEO). */
export const site = {
  owner: "vedantnarang",
  repo: "vedant",
  visibility: "Public",
  defaultBranch: "main",
  description:
    "Backend-leaning full-stack engineer. My career, presented as one GitHub repository.",
  githubProfileUrl: "https://github.com/vedantnarang",
  flickstatUrl: "https://flickstat.com",
  email: "vedant.narang36@gmail.com",
  location: "Gurugram / Delhi NCR",
} as const;

/** ISO timestamp of the last meaningful content change (drives "Updated …"). */
export const lastUpdated = "2026-08-24T10:00:00Z";
