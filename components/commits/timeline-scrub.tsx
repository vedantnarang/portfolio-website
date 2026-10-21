"use client";

import { useRef } from "react";
import { MOTION_OK, revealBelowFold, useGsapScope } from "@/lib/gsap";

/* The site's ONE pinned section (design.md §4, PLAN Phase 5 §7.3).
   Scrolling draws the timeline rail downward through the career and fills
   each month's commit ring as the line reaches it. Only decoration moves —
   rail (scaleY) and dots (scale) — so every commit stays fully readable at
   any scroll position and with JS or motion off.

   Desktop pins only when the whole timeline fits on screen: pinning
   something taller than the viewport would hide entries until release.
   Otherwise — and always below 768px, where pinning fights touch scroll —
   the rail scrubs with normal scrolling and groups below the fold fade in. */

const MD = "(min-width: 768px)";
/** Sticky tab bar height + breathing room; the pin sits below it. */
const PIN_TOP = 56;

export function CommitTimelineScrub({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGsapScope(ref, (mm, kit) => {
    const { gsap, ScrollTrigger } = kit;
    mm.add({ desktop: MD, motionOk: MOTION_OK }, (ctx) => {
      const { desktop, motionOk } = ctx.conditions as { desktop: boolean; motionOk: boolean };
      if (!motionOk) return; // server-rendered final state, nothing moves

      const section = ref.current!;
      const connector = section.querySelector("[data-timeline-connector]");
      const groups = Array.from(section.querySelectorAll<HTMLElement>("[data-timeline-group]"));
      // Measure the list, not the section: the section carries a min-height
      // (see the wrapper's className) that would always fail this check.
      const list = section.querySelector("ol")!;
      const pin = desktop && list.offsetHeight <= window.innerHeight - PIN_TOP - 24;

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: pin
          ? {
              trigger: section,
              start: `top ${PIN_TOP}px`,
              end: "+=150%",
              scrub: 1,
              pin: true,
              anticipatePin: 1,
            }
          : // clamp() keeps both ends within the page's real scroll range,
            // so a short page still draws the rail to the end.
            { trigger: section, start: "clamp(top 70%)", end: "clamp(bottom 70%)", scrub: 1 },
      });

      tl.fromTo(connector, { scaleY: 0 }, { scaleY: 1, duration: 1 }, 0);
      // Each ring fills when the rail reaches its group's offset.
      for (const group of groups) {
        const dot = group.querySelector("[data-timeline-dot]");
        const at = group.offsetTop / list.offsetHeight;
        tl.fromTo(dot, { scale: 0 }, { scale: 1, duration: 0.04, ease: "back.out(2)" }, at);
      }

      // Unpinned, groups can sit below the fold: give them the subtle reveal.
      if (!pin) revealBelowFold(kit, groups);

      // <details> bodies change the section's height; re-measure on toggle
      // (toggle doesn't bubble, hence the capture listener).
      const refresh = () => ScrollTrigger.refresh();
      section.addEventListener("toggle", refresh, true);
      return () => section.removeEventListener("toggle", refresh, true);
    });
  });

  /* The pin can only finish once the section's top scrolls up to PIN_TOP,
     which needs at least (viewport − PIN_TOP) of page from the section
     down. A short page doesn't have it and the scrub stalls short of the
     end — so on desktop with motion on, the section guarantees that room
     itself. Pure CSS, so it can't drift when fonts or content reflow. */
  return (
    <div ref={ref} className="relative md:motion-safe:min-h-[calc(100vh-56px)]">
      {children}
    </div>
  );
}
