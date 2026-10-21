"use client";

import { useEffect, type RefObject } from "react";
import type { gsap as GsapType } from "gsap";
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";

/* ============================================================
   The only door to GSAP (design.md §4: GSAP = scroll-driven
   choreography, Tailwind = everything simple).

   GSAP is never in a route's initial bundle: it's dynamically imported
   after hydration, by route-level motion components only, and only when
   there's something to animate (PLAN Phase 5 §7.1). Scroll motion is
   below-the-fold by definition, so loading it a beat later costs nothing
   visible — and keeps ~44KB off first load.
   ============================================================ */

export type Gsap = typeof GsapType;
export type ScrollTriggerStatic = typeof ScrollTriggerType;
export interface GsapKit {
  gsap: Gsap;
  ScrollTrigger: ScrollTriggerStatic;
}

let kit: Promise<GsapKit> | null = null;

/** Load gsap + ScrollTrigger once, registering the plugin on first use. */
export function loadGsap(): Promise<GsapKit> {
  kit ??= Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
    ([{ gsap }, { ScrollTrigger }]) => {
      gsap.registerPlugin(ScrollTrigger);
      return { gsap, ScrollTrigger };
    },
  );
  return kit;
}

/** Every motion setup runs inside this query, so reduced-motion users
   keep the server-rendered final state and nothing moves. */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

/**
 * Run GSAP setup scoped to `ref`'s subtree via gsap.matchMedia(). Each
 * `mm.add(query, fn)` block is reverted automatically when its query
 * stops matching, and everything is reverted on unmount — which
 * StrictMode's double-mount in development relies on.
 *
 * `shouldLoad` runs first, before GSAP is fetched: return false and the
 * library is never downloaded for this mount.
 */
export function useGsapScope(
  ref: RefObject<HTMLElement | null>,
  setup: (mm: gsap.MatchMedia, kit: GsapKit) => void,
  shouldLoad: (root: HTMLElement) => boolean = () => true,
) {
  useEffect(() => {
    const root = ref.current;
    if (!root || !window.matchMedia(MOTION_OK).matches || !shouldLoad(root)) return;

    let cancelled = false;
    let mm: gsap.MatchMedia | undefined;
    loadGsap().then((loaded) => {
      if (cancelled) return;
      mm = loaded.gsap.matchMedia(root);
      setup(mm, loaded);
      // Layout can settle after fonts swap in; re-measure trigger positions.
      document.fonts?.ready.then(() => {
        if (!cancelled) loaded.ScrollTrigger.refresh();
      });
    });
    return () => {
      cancelled = true;
      mm?.revert();
    };
    // Mount-only by design: the server markup being animated is static.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/** True when the element starts below the visible viewport. */
export function isBelowFold(el: Element): boolean {
  return el.getBoundingClientRect().top > window.innerHeight;
}

/**
 * design.md §4 "Scroll Reveal — Subtle", hydration-safe: elements already
 * on screen are left exactly as the server rendered them (no flash,
 * nothing hidden by JS); only content still below the fold fades in as it
 * scrolls into view.
 */
export function revealBelowFold({ gsap }: GsapKit, elements: Element[]) {
  for (const el of elements) {
    if (!isBelowFold(el)) continue;
    gsap.from(el, {
      opacity: 0,
      y: 12,
      duration: 0.35,
      ease: "power1.out",
      scrollTrigger: {
        trigger: el,
        start: "top 90%",
        toggleActions: "play none none reverse",
      },
    });
  }
}
