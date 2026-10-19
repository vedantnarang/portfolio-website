import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  /* Content lives as .mdx under /content (loaded via fs + dynamic imports),
     so MDX never becomes a route itself — pageExtensions is still required
     for @next/mdx compilation. */
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  /* The contact success page renders per request (cookies) and scans
     content/issues for the next fake issue number — ship those files with
     its server function instead of trusting the tracer to find them. */
  outputFileTracingIncludes: {
    "/issues/new/success": ["./content/issues/**/*"],
  },
  async redirects() {
    return [
      {
        source: "/pull/:id",
        destination: "/pull/:id/conversation",
        permanent: false,
      },
    ];
  },
};

/* remark-frontmatter teaches the compiler to skip the YAML block instead of
   rendering it as a thematic break. Data extraction happens separately via
   gray-matter in lib/mdx.ts (server-only). String-form plugin config keeps
   Turbopack happy (serializable options only). */
const withMDX = createMDX({
  options: {
    remarkPlugins: [["remark-frontmatter", ["yaml"]]],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);
