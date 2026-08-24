/* Thin typographic wrapper around rendered MDX. Element-level GitHub
   styling lives in mdx-components.tsx (token-mapped); this provides the
   base rhythm and kills top-margin on the first child. */
export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-w-0 text-base leading-7 text-ink [&>*:first-child]:mt-0">
      {children}
    </div>
  );
}
