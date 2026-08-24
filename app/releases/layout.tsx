import { RepoChrome } from "@/components/repo-chrome";

export default function ReleasesLayout({ children }: { children: React.ReactNode }) {
  return <RepoChrome active="releases">{children}</RepoChrome>;
}
