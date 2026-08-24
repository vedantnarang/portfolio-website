import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  /* Content lives as .mdx under /content (loaded via fs + dynamic imports),
     so MDX never becomes a route itself — pageExtensions is still required
     for @next/mdx compilation. */
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
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
