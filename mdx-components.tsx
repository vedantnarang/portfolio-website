import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import { Diff } from "@/components/mdx/diff";

/* Global MDX element mapping = GitHub-markdown styling via design tokens.
   Consumed by every compiled MDX module (readme, pulls, issues later). */

function Anchor({
  href,
  children,
}: {
  href?: string | undefined;
  children: React.ReactNode;
}) {
  if (href && href.startsWith("/")) {
    return (
      <Link href={href} className="text-link hover:underline">
        {children}
      </Link>
    );
  }
  return (
    <a
      href={href}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      className="text-link hover:underline"
    >
      {children}
    </a>
  );
}

const components: MDXComponents = {
  Diff,
  h1: ({ children }) => (
    <h1 className="mt-6 mb-4 pb-2 text-2xl font-semibold border-b border-line first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-6 mb-4 pb-1.5 text-xl font-semibold border-b border-line-muted">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-6 mb-4 text-base font-semibold">{children}</h3>
  ),
  p: ({ children }) => <p className="mb-4 leading-7">{children}</p>,
  a: Anchor,
  ul: ({ children }) => (
    <ul className="mb-4 pl-8 list-disc marker:text-faint">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-4 pl-8 list-decimal marker:text-faint">{children}</ol>
  ),
  li: ({ children }) => <li className="mt-1.5 leading-7">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  blockquote: ({ children }) => (
    <blockquote className="pl-4 my-4 text-muted border-l-4 border-line">
      {children}
    </blockquote>
  ),
  code: ({ children }) => (
    <code className="px-1 py-0.5 font-mono text-[85%] rounded-md bg-inset">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="p-4 mb-4 overflow-x-auto text-xs leading-5 rounded-md bg-inset [&_code]:bg-transparent [&_code]:p-0">
      {children}
    </pre>
  ),
  hr: () => <hr className="my-6 border-line" />,
  table: ({ children }) => (
    <div className="mb-4 overflow-x-auto">
      <table className="w-full text-sm border-collapse border-spacing-0 table-fixed">
        {children}
      </table>
    </div>
  ),
  th: ({ children }) => (
    <th className="p-2 font-semibold text-left border border-line bg-subtle">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="p-2 align-top border border-line">{children}</td>
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
