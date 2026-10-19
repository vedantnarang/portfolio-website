import fs from "node:fs";
import path from "node:path";

/* The fake issue number shown on the success page: highest real issue id
   + 1 (spec §6). Scanned from content/issues at request time so the number
   stays correct once the /issues surface lands on this branch. */
export function getNextIssueNumber(): number {
  const dir = path.join(process.cwd(), "content", "issues");
  if (!fs.existsSync(dir)) return 13;
  const ids = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => parseInt(f, 10))
    .filter(Number.isInteger);
  return ids.length ? Math.max(...ids) + 1 : 1;
}
