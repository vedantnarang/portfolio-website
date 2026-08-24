import { RepoChrome } from "@/components/repo-chrome";

/* Section layouts own their tab state, keeping TabBar a pure server
   component (active underline without usePathname / client JS). */
export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return <RepoChrome active="code">{children}</RepoChrome>;
}
