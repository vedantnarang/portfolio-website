import { RepoChrome } from "@/components/repo-chrome";

export default function PullsLayout({ children }: { children: React.ReactNode }) {
  return <RepoChrome active="pulls">{children}</RepoChrome>;
}
