import { getContributingRaw } from "@/lib/content";

/* The blob viewer's Raw button: exact source as plain text, prerendered
   at build like every other route. */
export const dynamic = "force-static";

export function GET() {
  return new Response(getContributingRaw(), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
