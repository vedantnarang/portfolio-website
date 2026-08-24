import { site } from "@/data/site";
import { getSkills } from "@/lib/content";
import { LanguageBar } from "@/components/language-bar";
import { LinkIcon, LocationIcon, MailIcon } from "@/components/icons";

/* Spec §2d — the honest About panel: description, contact rows, topic pills,
   language bar, collapsible tools. Stacks below the README under 1024px
   (single responsive component). */
export function SidebarAbout() {
  const skills = getSkills();

  return (
    <aside aria-label="About this repository" className="min-w-0 space-y-6">
      <section>
        <h2 className="mb-3 text-base font-semibold">About</h2>
        <p className="text-sm leading-6">{site.description}</p>
        <ul className="mt-4 space-y-2 text-sm">
          <li className="flex items-center gap-2 text-muted">
            <LocationIcon />
            <span>{site.location}</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-muted">
              <LinkIcon />
            </span>
            <a
              href={site.flickstatUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-link font-medium hover:underline"
            >
              flickstat.com
            </a>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-muted">
              <MailIcon />
            </span>
            <a
              href={`mailto:${site.email}`}
              className="text-link font-medium break-all hover:underline"
            >
              {site.email}
            </a>
          </li>
        </ul>
      </section>

      <section>
        <h2 className="mb-3 text-base font-semibold">Topics</h2>
        <ul className="flex flex-wrap gap-2">
          {skills.topics.map((topic) => (
            <li key={topic}>
              <span className="inline-block rounded-full bg-link-tint px-2.5 py-0.5 text-xs font-medium text-link">
                {topic}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-3 text-base font-semibold">Languages</h2>
        <LanguageBar languages={skills.languages} />
      </section>

      <details className="border-t border-line pt-4">
        <summary className="cursor-pointer select-none text-base font-semibold marker:text-faint">
          Tools
        </summary>
        <p className="mt-2 text-sm leading-6 text-muted">
          {skills.tools.join(" · ")}
        </p>
      </details>
    </aside>
  );
}
