import { RepoChrome } from "@/components/repo-chrome";

export default function IssuesLayout({ children }: { children: React.ReactNode }) {
  return <RepoChrome active="issues">{children}</RepoChrome>;
}
