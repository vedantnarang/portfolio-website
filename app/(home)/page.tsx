import { PageShell } from "@/components/page-shell";
import { Prose } from "@/components/prose";
import { FileTree } from "@/components/home/file-tree";
import { SidebarAbout } from "@/components/home/sidebar-about";
import { getReadme } from "@/lib/content";

/* Spec §2 — three stacked zones like a real repo page:
   file tree (nav + ToC), rendered README, About sidebar. */
export default async function HomePage() {
  const { content } = await getReadme();
  const Readme = content.Component;

  return (
    <PageShell>
      <div className="grid grid-cols-1 gap-8 py-6 lg:grid-cols-[minmax(0,1fr)_296px]">
        <main className="min-w-0 space-y-6">
          <FileTree />
          <article
            id="about"
            aria-label="README"
            className="rounded-md border border-line p-4 sm:p-6"
          >
            <Prose>
              <Readme />
            </Prose>
          </article>
        </main>
        <SidebarAbout />
      </div>
    </PageShell>
  );
}
