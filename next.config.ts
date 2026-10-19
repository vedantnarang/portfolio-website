import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  /* Content lives as .mdx under /content (loaded via fs + dynamic imports),
     so MDX never becomes a route itself — pageExtensions is still required
     for @next/mdx compilation. */
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  experimental: {
    /* Static generation runs one worker with low in-flight concurrency:
       this dev machine sits near OOM (~1GB free), which crashed parallel
       build workers with STATUS_STACK_BUFFER_OVERRUN. Harmless-slow on
       beefier machines at this site's page count (~35). */
    staticGenerationRetryCount: 2,
    staticGenerationMaxConcurrency: 2,
    staticGenerationMinPagesPerWorker: 64,
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
