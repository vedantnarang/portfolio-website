import { RepoChrome } from "@/components/repo-chrome";

export default function CommitsLayout({ children }: { children: React.ReactNode }) {
  return <RepoChrome active="commits">{children}</RepoChrome>;
}
