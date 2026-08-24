# Design System — `vedantnarang/vedant` Portfolio

**Source of truth for all visual decisions.** Every new component MUST consume these tokens — no raw hex values in components.

- **Direction:** Minimalism & Swiss Style (per ui-ux-pro-max design-system query), executed with **GitHub Primer fidelity** — the site's entire concept is "your career is one GitHub repo", so colors mirror GitHub's real palette rather than an approximation. The skill's generated slate/green palette (`#0F172A` family, `#22C55E`) is retained only as fallback guidance if a Primer value doesn't fit a context.
- **Typography:** `Inter` (UI sans) · `JetBrains Mono` (code, hashes, metadata, diffs) — both sanctioned by portfolio-spec §10 and the skill's pairing output.
- **Modes:** Light + Dark, defaulting to system (`prefers-color-scheme`). All pairs below pass ≥4.5:1 text contrast in both modes.

---

## 1. Semantic color tokens

### Dark mode (Primer Dark — canonical reference values)

| Token | Value | Used for |
|---|---|---|
| `--canvas-default` | `#0d1117` | Page background |
| `--canvas-inset` | `#010409` | Header bar, wells, inset panels |
| `--canvas-subtle` | `#161b22` | Cards, list-row hover, code blocks |
| `--canvas-overlay` | `#161b22` | Modals, dropdowns, tooltips |
| `--fg-default` | `#e6edf3` | Primary text |
| `--fg-muted` | `#8b949e` | Secondary text, timestamps, commit hashes |
| `--fg-subtle` | `#6e7681` | Disabled text, placeholder |
| `--border-default` | `#30363d` | Borders, dividers, inputs |
| `--border-muted` | `#21262d` | Table row separators, card edges |
| `--accent-fg` | `#58a6ff` | Links, selected tab underline, focus ring |
| `--accent-emphasis` | `#1f6feb` | Selected state fill, active chips |
| `--accent-subtle` | `rgba(56,139,253,0.15)` | Info banners, link-tinted backgrounds |
| `--success-fg` | `#3fb950` | Open PR icon, "verified" badge, additions count |
| `--success-emphasis` | `#238636` | Primary button bg (**Hire**, Submit new issue) |
| `--success-subtle` | `rgba(46,160,67,0.15)` | Green label backgrounds |
| `--attention-fg` | `#d29922` | Warnings, tech-debt labels |
| `--attention-subtle` | `rgba(187,128,9,0.15)` | Amber label backgrounds |
| `--danger-fg` | `#f85149` | Closed issues, deletions count, errors |
| `--danger-subtle` | `rgba(248,81,73,0.15)` | Red label backgrounds |
| `--done-fg` | `#a371f7` | Merged PR icon, purple accents |
| `--neutral-emphasis` | `#6e7681` | Draft icons, counters/pills bg |

### Light mode (Primer Light)

| Token | Value | Notes |
|---|---|---|
| `--canvas-default` | `#ffffff` | Page background |
| `--canvas-inset` | `#f6f8fa` | Header bar, wells |
| `--canvas-subtle` | `#f6f8fa` | Cards, hover rows |
| `--canvas-overlay` | `#ffffff` | Modals, dropdowns |
| `--fg-default` | `#1f2328` | Primary text |
| `--fg-muted` | `#656d76` | Secondary text |
| `--fg-subtle` | `#818b98` | Placeholder, disabled |
| `--border-default` | `#d0d7de` | Borders, dividers, inputs |
| `--border-muted` | `#d8dee4` | Row separators |
| `--accent-fg` | `#0969da` | Links, focus ring |
| `--accent-emphasis` | `#0969da` | Active fills |
| `--accent-subtle` | `#ddf4ff` | Info backgrounds |
| `--success-fg` | `#1a7f37` | Open states, additions |
| `--success-emphasis` | `#1f883d` | Primary buttons |
| `--success-subtle` | `#dafbe1` | Green labels |
| `--attention-fg` | `#9a6700` | Warnings |
| `--attention-subtle` | `#fff8c5` | Amber labels |
| `--danger-fg` | `#cf222e` | Closed states, errors |
| `--danger-subtle` | `#ffebe9` | Red labels |
| `--done-fg` | `#8250df` | Merged states |
| `--neutral-emphasis` | `#6e7781` | Counters, drafts |

### Tailwind classes (IMPLEMENTED in `app/globals.css` — use these directly)

Dark mode is class-based (`<html class="dark">`); a boot script in `app/layout.tsx` applies system preference or saved choice before paint. Never write `dark:` variants for colors or arbitrary hex like `text-[#e6edf3]` — every token below auto-switches between modes.

| Light value | Dark value | Utility |
|---|---|---|
| `#ffffff` | `#0d1117` | `bg-canvas` · `text-canvas` |
| `#f6f8fa` | `#010409` | `bg-inset` |
| `#f6f8fa` | `#161b22` | `bg-subtle` (cards, hover rows) · `bg-overlay` (modals) |
| row-hover | row-hover | `hover:bg-hover` |
| `#1f2328` | `#e6edf3` | `text-ink` (primary text) |
| `#656d76` | `#8b949e` | `text-muted` (secondary text) |
| `#818b98` | `#6e7681` | `text-faint` (placeholder/disabled) |
| `#d0d7de` | `#30363d` | `border-line` |
| `#d8dee4` | `#21262d` | `border-line-muted` |
| `#0969da` | `#58a6ff` | `text-link` · `bg-link-tint` |
| `#1a7f37` | `#3fb950` | `text-success` (open states) · `bg-success-tint` |
| `#1f883d` | `#238636` | `bg-btn-primary` (primary CTA buttons) |
| `#9a6700` | `#d29922` | `text-warn` · `bg-warn-tint` |
| `#cf222e` | `#f85149` | `text-danger` · `bg-danger-tint` |
| `#8250df` | `#a371f7` | `text-done` (merged states) |
| `#6e7781` | `#6e7681` | `text-neutral` / `bg-neutral` (counters, drafts) |

**Diff tokens** (Diff component only): `bg-diff-add-line` · `bg-diff-add-word` · `bg-diff-del-line` · `bg-diff-del-word` · `bg-diff-hunk`.

**Language bar** (static brand colors, never themed): `bg-lang-ts` · `bg-lang-js` · `bg-lang-py` · `bg-lang-java` · `bg-lang-sql` · `bg-lang-other`.

**Fonts:** `font-sans` → Inter, `font-mono` → JetBrains Mono (wired via `next/font` in `app/layout.tsx`).

---

## 2. Domain-specific colors

### Diff view (spec §3 — must survive projector + colorblind check; GitHub's own palette)

| Token | Dark | Light | Used for |
|---|---|---|---|
| `--diff-add-line` | `rgba(46,160,67,0.15)` | `#e6ffec` | Added-line background |
| `--diff-add-word` | `rgba(46,160,67,0.40)` | `#abf2bc` | Added-token highlight |
| `--diff-add-fg` | `#3fb950` | `#1a7f37` | `+N` counter, gutter marker |
| `--diff-del-line` | `rgba(248,81,73,0.15)` | `#ffebe9` | Deleted-line background |
| `--diff-del-word` | `rgba(248,81,73,0.40)` | `#ffc1bc` | Deleted-token highlight |
| `--diff-del-fg` | `#f85149` | `#cf222e` | `-N` counter, gutter marker |
| `--diff-hunk-bg` | `rgba(56,139,253,0.10)` | `#ddf4ff` | Hunk-header strip (`@@ -12,7 @@`) |

Never rely on red/green alone — always pair with `+`/`−` glyphs (GitHub does this too).

### State colors (PRs, issues, timeline)

| State | Token | Icon shape |
|---|---|---|
| Open PR / Open issue | `success` | Circle |
| Merged PR | `done` | Circle-with-square |
| Closed PR (unmerged) / Closed issue | `danger` | Circle-with-cross |
| Draft PR | `neutral-emphasis` | Dashed circle |

### Labels & pills

| Label | Background | Foreground | Border |
|---|---|---|---|
| `enhancement`, `help wanted`, `good first issue` | `success-subtle` | `success-fg` | none |
| `tech-debt` | `attention-subtle` | `attention-fg` | none |
| `learning`, `question` | `accent-subtle` | `accent-fg` | none |
| `backend` `frontend` `data` `ai` `infra` (filter chips) | `canvas-subtle` | `fg-muted` | `border-default`; active chip = `accent-emphasis` bg, white fg |
| `P1` `P2` `P3` priority | transparent | `fg-muted` | `border-default` (outline pill) |
| Counts in nav tabs | `neutral-emphasis` bg | `fg-default` | none |

### Language bar (sidebar skills — spec §2d)

GitHub Linguist colors; strip segments sized by percentage.

| Language | Hex | Share |
|---|---|---|
| TypeScript | `#3178c6` | 41.2% |
| JavaScript | `#f1e05a` | 22.8% |
| Python | `#3572A5` | 22.8%→14.6% |
| Java | `#b07219` | 11.1% |
| SQL | `#e38c00` | 7.3% |
| Other | `#8b949e` | 3.0% |

These are fixed brand-identifying colors — identical in light AND dark mode (do not theme them).

### Code / syntax

Use Shiki themes `github-dark` / `github-light` so fenced code inherits this palette automatically. No custom syntax theme.

---

## 3. Rules (non-negotiable)

1. **Tokens only.** Components read `var(--…)` / Tailwind mapped utilities. Zero raw hex outside this file (language-bar brand colors excepted).
2. **Contrast:** body text ≥4.5:1, large text/UI chrome ≥3:1, both modes. `fg-muted` is the floor for readable secondary text — never dimmer.
3. **Focus rings visible:** 2px `accent-fg` outline, never removed.
4. **No emojis as icons** — SVG only (Octicons set fits the theme).
5. **Buttons:** primary = `success-emphasis`; secondary = `canvas-subtle` + `border-default`. Hover shifts one step lighter/darker, transition 150–250ms.
6. **No fake star counts, no loading spinners >300ms** (spec §14).

---

## 4. Motion system

**Division of labor (standing rule):**
- **Tailwind CSS handles simple animations** — hover/active transitions, fades, slide-ins, loading pulses. Use built-in transitions or the ready-made utilities: `animate-fade-in`, `animate-slide-up`, `animate-live-dot` (defined in `globals.css`).
- **GSAP + ScrollTrigger handles complex choreography only** — scroll-linked reveals, staggered lists, pinned sections, SplitText.

Registered once client-side: `gsap.registerPlugin(ScrollTrigger)`. All GSAP presets respect `prefers-reduced-motion` via `gsap.matchMedia()` — when reduced, render final state immediately, animate nothing.

| Preset | Where used | Recipe |
|---|---|---|
| **Scroll Reveal — Subtle** | File-tree rows, README sections, commit entries, issue rows | `gsap.from(el, { opacity: 0, y: 12, duration: 0.35, ease: 'power1.out', scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none reverse' } })` — y offset stays ≤16px so it reads as fade, not slide |
| **Stagger List** | Topics pills, language legend, PR list rows | `gsap.from('.row', { opacity: 0, scale: 0.92, y: 16, duration: 0.4, stagger: { each: 0.06, from: 'start', grid: 'auto' }, ease: 'back.out(1.4)' })` |
| **Scroll Reveal — Pinned scrub** | `/commits` timeline only | `gsap.timeline({ scrollTrigger: { trigger: section, start: 'top top', end: '+=150%', scrub: 1, pin: true } })` — **max 1 pinned section site-wide**; call `ScrollTrigger.refresh()` after fonts/images load |

**Constraints:**
- Durations 300–450ms for enter transitions; exits faster than enters.
- Animate only `transform` and `opacity` — never width/height/top/left.
- SplitText only on headlines <8 words; call `.revert()` on unmount for screen readers.
- Below-the-fold content needed by crawlers gets a no-JS fallback (content visible without JS).
- Test pinning on mid-tier mobile before shipping.

---

## 5. Fallback palette (skill-generated, kept for reference)

If a future component needs a non-GitHub surface (OG images, share cards): Primary `#0F172A`, Accent `#22C55E`, Background `#020617`, Card `#0E1223`, Border `#334155`, Muted-fg `#94A3B8` — JetBrains Mono display type, sharp shadows, minimal effects.
