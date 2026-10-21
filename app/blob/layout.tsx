import { RepoChrome } from "@/components/repo-chrome";

/* Files live under the Code tab, as on GitHub. */
export default function BlobLayout({ children }: { children: React.ReactNode }) {
  return <RepoChrome active="code">{children}</RepoChrome>;
}
