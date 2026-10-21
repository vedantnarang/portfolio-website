import type { Metadata } from "next";
import Link from "next/link";
import { marked } from "marked";
import {
  getAllPullRequests,
  getCommits,
  getIssue,
  getPullSummaryMarkdown,
  getReadme,
  getReleases,
  getSkills,
} from "@/lib/content";
import { langNames } from "@/data/skills";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Plain view",
  description:
    "The whole site as one plain page — about, experience, projects, résumé and contact.",
};

const DATE_FMT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

/* Spec §10 escape hatch: the entire site as one semantic HTML page for
   recruiters in a hurry, screen readers, and anyone who'd rather not learn
   the GitHub metaphor. No repo chrome, no client JS, no motion; readable
   with CSS disabled. Built from the same loaders as the themed pages, so
   it can't drift structurally. */
export default async function PlainViewPage() {
  const [{ content: readme }, prs, roles] = await Promise.all([
    getReadme(),
    getAllPullRequests(),
    getIssue(1),
  ]);
  const commits = getCommits();
  const latest = getReleases().find((r) => r.latest);
  const skills = getSkills();
  const Readme = readme.Component;
  const Roles = roles?.body.Component;

  return (
    <main className="mx-auto w-full max-w-[72ch] px-4 py-10 text-base leading-7 sm:px-6 [&_h2]:mt-12 [&_h2]:mb-3 [&_h2]:border-b [&_h2]:border-line [&_h2]:pb-1 [&_h2]:text-xl [&_h2]:font-semibold [&_a]:text-link [&_a]:underline">
      <p className="mb-6 text-sm">
        <Link href="/">← Back to the full site</Link>
      </p>

      <p className="text-sm">
        <a href={`mailto:${site.email}`}>{site.email}</a> · {site.location}
        {latest?.pdfPath && (
          <>
            {" "}·{" "}
            <a href={latest.pdfPath} download="vedant-narang-resume.pdf">
              Résumé (PDF)
            </a>
          </>
        )}
      </p>

      <nav aria-label="Sections" className="mt-3 text-sm">
        <ul className="flex flex-wrap gap-x-4 gap-y-1">
          {[
            ["about", "About"],
            ["experience", "Experience"],
            ["projects", "Projects"],
            ["resume", "Résumé"],
            ["looking-for", "Looking for"],
            ["skills", "Skills"],
            ["contact", "Contact"],
          ].map(([id, label]) => (
            <li key={id}>
              <a href={`#${id}`}>{label}</a>
            </li>
          ))}
        </ul>
      </nav>

      {/* The README supplies the page's only h1 (its "# Vedant Narang")
          and its sections read as h2s alongside the ones below. */}
      <section id="about" aria-label="About" className="mt-8">
        <Readme />
      </section>

      <section id="experience" aria-labelledby="experience-h">
        <h2 id="experience-h">Experience and education</h2>
        <ol className="space-y-4">
          {commits.map((c) => (
            <li key={c.hash}>
              <p>
                <time dateTime={c.date} className="font-mono text-sm text-muted">
                  {DATE_FMT.format(new Date(c.date))}
                </time>{" "}
                — <strong>{c.message.replace(/^[a-z]+(\([a-z]+\))?: /, "")}</strong>
                {c.verified && " (current role)"}
              </p>
              {c.body && <p className="text-muted">{c.body}</p>}
            </li>
          ))}
        </ol>
      </section>

      <section id="projects" aria-labelledby="projects-h">
        <h2 id="projects-h">Projects</h2>
        {prs.map((pr) => (
          <article key={pr.id} aria-labelledby={`pr-${pr.id}`} className="mt-8">
            <h3 id={`pr-${pr.id}`} className="text-lg font-semibold">
              {pr.title}
            </h3>
            <p className="text-sm text-muted">
              {pr.state === "open" ? "Ongoing" : "Shipped"}
              {pr.mergedAt && ` ${DATE_FMT.format(new Date(pr.mergedAt))}`} ·{" "}
              {pr.labels.map((l) => l.name).join(", ")}
            </p>
            <div
              className="mt-2 [&_blockquote]:border-l-4 [&_blockquote]:border-line [&_blockquote]:pl-3 [&_blockquote]:text-muted [&_p]:mb-3 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_code]:font-mono [&_code]:text-[90%]"
              dangerouslySetInnerHTML={{
                __html: marked.parse(getPullSummaryMarkdown(pr.id), { async: false }),
              }}
            />
            <p className="text-sm">
              <Link href={`/pull/${pr.id}/conversation`}>Full case study</Link>
              {pr.liveUrl && (
                <>
                  {" "}· <a href={pr.liveUrl}>Live site</a>
                </>
              )}
            </p>
          </article>
        ))}
      </section>

      <section id="resume" aria-labelledby="resume-h">
        <h2 id="resume-h">Résumé</h2>
        {latest?.pdfPath ? (
          <p>
            Current version {latest.version}:{" "}
            <a href={latest.pdfPath} download="vedant-narang-resume.pdf">
              download the PDF
            </a>{" "}
            ({latest.sizeKb} KB). Earlier versions and changelogs are on the{" "}
            <Link href="/releases">releases page</Link>.
          </p>
        ) : (
          <p>
            See the <Link href="/releases">releases page</Link>.
          </p>
        )}
      </section>

      {Roles && (
        <section id="looking-for" aria-labelledby="looking-for-h">
          <h2 id="looking-for-h">What I&#39;m looking for</h2>
          <Roles />
        </section>
      )}

      <section id="skills" aria-labelledby="skills-h">
        <h2 id="skills-h">Skills</h2>
        <p>
          <strong>Languages:</strong>{" "}
          {skills.languages.map((l) => `${langNames[l.name]} (${l.pct}%)`).join(", ")}
        </p>
        <p>
          <strong>Topics:</strong> {skills.topics.join(", ")}
        </p>
        <p>
          <strong>Tools:</strong> {skills.tools.join(", ")}
        </p>
        <p className="mt-3">
          How I work with a team:{" "}
          <Link href="/blob/main/CONTRIBUTING.md">CONTRIBUTING.md</Link>.
        </p>
      </section>

      <section id="contact" aria-labelledby="contact-h">
        <h2 id="contact-h">Contact</h2>
        <ul className="list-disc pl-6">
          <li>
            Email: <a href={`mailto:${site.email}`}>{site.email}</a>
          </li>
          <li>
            LinkedIn: <a href={site.linkedinUrl}>{site.linkedinUrl.replace(/^https:\/\//, "")}</a>
          </li>
          <li>
            GitHub: <a href={site.githubProfileUrl}>{site.githubProfileUrl.replace(/^https:\/\//, "")}</a>
          </li>
          <li>
            Or <Link href="/issues/new">open an issue</Link> through the contact form.
          </li>
        </ul>
      </section>
    </main>
  );
}
