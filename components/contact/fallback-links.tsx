import { site } from "@/data/site";
import { MailIcon, LinkIcon, RepoIcon } from "@/components/icons";

/* Plain-text escape hatch (spec §6): contact must never be gated behind
   the form. Server component so it costs no hydration. */
export function FallbackLinks() {
  return (
    <section
      aria-labelledby="fallback-links-heading"
      className="rounded-md border border-line bg-subtle p-4"
    >
      <h2 id="fallback-links-heading" className="mb-2 text-sm font-semibold">
        Prefer not to use a form?
      </h2>
      <p className="mb-3 text-sm text-muted">
        Reach out directly — no form needed:
      </p>
      <ul className="space-y-2 text-sm">
        <FallbackLink
          href={`mailto:${site.email}?subject=${encodeURIComponent(
            "[vedant repo] New issue",
          )}`}
          icon={<MailIcon />}
        >
          {site.email}
        </FallbackLink>
        <FallbackLink href={site.linkedinUrl} icon={<LinkIcon />}>
          LinkedIn
        </FallbackLink>
        <FallbackLink href={site.githubProfileUrl} icon={<RepoIcon />}>
          GitHub
        </FallbackLink>
      </ul>
    </section>
  );
}

function FallbackLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <li>
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        className="inline-flex items-center gap-2 text-link hover:underline"
      >
        {icon}
        {children}
      </a>
    </li>
  );
}
