import { site } from "@/data/site";
import { MailIcon, LinkIcon, RepoIcon } from "@/components/icons";

/* Plain-text escape hatch (spec §6): contact must never be gated behind
   the form. Server component so it costs no hydration. `card` sits beside
   the form on /issues/new; `inline` is the site footer row. */

const LINKS = [
  {
    href: `mailto:${site.email}?subject=${encodeURIComponent(
      `[${site.repo} repo] New issue`,
    )}`,
    icon: <MailIcon />,
    label: site.email,
  },
  { href: site.linkedinUrl, icon: <LinkIcon />, label: "LinkedIn" },
  { href: site.githubProfileUrl, icon: <RepoIcon />, label: "GitHub" },
];

export function FallbackLinks({
  variant = "card",
}: {
  variant?: "card" | "inline";
}) {
  if (variant === "inline") {
    return (
      <ul className="flex flex-wrap items-center gap-x-4 gap-y-2">
        {LINKS.map((link) => (
          <FallbackLink key={link.label} {...link} />
        ))}
      </ul>
    );
  }

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
        {LINKS.map((link) => (
          <FallbackLink key={link.label} {...link} />
        ))}
      </ul>
    </section>
  );
}

function FallbackLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  const external = href.startsWith("http");
  return (
    <li className="min-w-0">
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="inline-flex min-w-0 items-center gap-2 break-all text-link hover:underline"
      >
        {icon}
        {label}
      </a>
    </li>
  );
}
