"use client";

import { useRef } from "react";
import { MOTION_OK, isBelowFold, revealBelowFold, useGsapScope } from "@/lib/gsap";

/* Scroll reveals for a server-rendered subtree. Renders one plain <div>
   around its children and never changes their markup, so the hydrated DOM
   is identical to the server's. `selector` picks the blocks to reveal,
   scoped to this subtree. If none of them start below the fold, GSAP is
   never downloaded at all. */
export function RevealProvider({
  selector,
  className,
  children,
}: {
  selector: string;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const targets = (root: HTMLElement) => Array.from(root.querySelectorAll(selector));

  useGsapScope(
    ref,
    (mm, kit) => {
      mm.add(MOTION_OK, () => {
        revealBelowFold(kit, targets(ref.current!));
      });
    },
    (root) => targets(root).some(isBelowFold),
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
