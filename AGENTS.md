# AGENTS.md

Operating rules for AI coding agents in this repository. These are **binding constraints**, not suggestions. When a rule conflicts with your default behaviour, this file wins. When this file conflicts with an explicit instruction from the human in the current conversation, the human wins.

If a rule here appears wrong for the task at hand, **say so and ask** — do not silently deviate.

---

## 0. Project Profile

> Edit this block per project. Everything below assumes these values.

| Key | Value |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript, `strict: true` |
| Runtime | Node.js 20+ |
| Styling | Tailwind CSS |
| Component library | shadcn/ui (Radix primitives) |
| Package manager | `<pnpm \| npm \| yarn \| bun>` |
| Testing | `<vitest \| jest \| playwright \| none>` |
| Deployment target | `<vercel \| node \| docker \| static>` |
| Path alias | `@/*` → `./src/*` |

**Pages Router is not used.** If you find `pages/` files, flag them; do not add to them.

---

## 1. Non-Negotiables

Read this section even if you read nothing else.

1. **Server Components by default.** `"use client"` is opt-in and must be justified.
2. **One component, one job.** If you can describe it with "and", split it.
3. **No component over ~150 lines.** Over that, extract.
4. **Responsive is not a follow-up task.** Every component ships mobile-first and works from 320px up.
5. **Never duplicate a component to handle mobile vs desktop unless Section 5.4 explicitly permits it.**
6. **No `any`.** Use `unknown` and narrow.
7. **No new dependency without asking.** Check if shadcn/ui, Radix, or the stdlib already does it.
8. **Do not restructure, rename, or "clean up" files you were not asked to touch.**
9. **Do not invent APIs, env vars, routes, or DB fields.** Read the code first; ask if it isn't there.
10. **If the task is ambiguous, ask one clarifying question before writing code.** Do not guess and produce 400 lines.

---

## 2. Before You Write Code

- Read the existing neighbours of the file you're about to create. Match their patterns.
- Search for prior art: `grep` for a similar component/hook/util before writing a new one.
- Check `components/ui/` before building any primitive. It is probably already there.
- Check `package.json` before importing anything.
- State your plan in 2–5 bullets for any change touching 3+ files. Then execute.

---

## 3. File & Folder Structure

```
src/
  app/                       # routing only — thin files
    (marketing)/             # route groups for layout boundaries
    (app)/
    api/
    layout.tsx
    page.tsx
    loading.tsx
    error.tsx
    not-found.tsx
  components/
    ui/                      # shadcn primitives — DO NOT hand-edit unless asked
    layout/                  # header, footer, sidebar, shells
    <feature>/               # feature-scoped components
  features/<feature>/        # optional: colocated logic for large features
    components/
    hooks/
    actions.ts
    schema.ts
    types.ts
  hooks/                     # cross-feature hooks only
  lib/                       # pure utilities, clients, config
  server/                    # server-only code (db, auth, services)
  types/                     # shared/global types
  styles/
```

### Rules

- **Route files stay thin.** A `page.tsx` fetches data and composes components. Business logic and heavy JSX belong in `components/` or `features/`.
- **Colocate first, promote later.** A component used by one feature lives in that feature. Move it to `components/` only when a second consumer appears. Do not pre-promote.
- **No barrel files (`index.ts` re-exports) for component folders.** They defeat tree-shaking and create import cycles. Import from the concrete path.
- **Mark server-only modules.** Anything touching secrets, the DB, or the filesystem imports `server-only` at the top.

### Naming

| Thing | Convention | Example |
|---|---|---|
| Component files | `kebab-case.tsx` | `user-profile-card.tsx` |
| Components | `PascalCase` | `UserProfileCard` |
| Hooks | `use-*.ts` / `useThing` | `use-media-query.ts` |
| Server actions | `*-actions.ts`, verb names | `create-invoice` |
| Types/interfaces | `PascalCase`, no `I` prefix | `Invoice`, not `IInvoice` |
| Booleans | `is/has/should/can` | `isLoading`, `hasAccess` |
| Event handlers | `handle*` internal, `on*` prop | `onSelect={handleSelect}` |
| Constants | `SCREAMING_SNAKE` | `MAX_UPLOAD_BYTES` |

Match the existing repo if it disagrees with this table. Consistency beats correctness here.

---

## 4. Server vs Client Components

**Default to Server Components.** Add `"use client"` only when the file needs one of:

- `useState`, `useReducer`, `useEffect`, `useRef` on DOM
- Event handlers (`onClick`, `onChange`, …)
- Browser APIs (`window`, `localStorage`, `IntersectionObserver`)
- Context providers, or a library that requires them

### Rules

- **Push `"use client"` to the leaves.** Don't mark a page client just because one button is interactive. Extract the button.
- **Pass Server Components as `children`/props into Client Components** instead of importing them inside the client boundary.
- **Props crossing the boundary must be serialisable.** No functions, classes, Dates-as-instances, or Maps into a client component from the server.
- **Never leak secrets.** Anything not prefixed `NEXT_PUBLIC_` must never be referenced in a client file. Validate env vars in one place (`lib/env.ts`) with Zod, not with scattered `process.env.X!`.
- `params` and `searchParams` are **Promises** — `await` them.

---

## 5. Component Architecture

### 5.1 Single responsibility

A component does one of: **render a view**, **hold layout**, or **manage a piece of state**. Not all three.

Split when any of these is true:
- Two or more distinct render concerns in one file
- Over ~150 lines
- Over ~7 props
- More than 2 levels of ternary/conditional nesting in JSX
- A named sub-block you'd naturally describe as "the X part"

### 5.2 Composition over configuration

Prefer slots to booleans. When a component grows a third `variant`/`show*` flag, stop and restructure.

```tsx
// ✗ Configuration creep
<Card title="X" showFooter hasIcon isCompact variant="bordered" />

// ✓ Composition
<Card>
  <CardHeader><CardTitle>X</CardTitle></CardHeader>
  <CardContent>…</CardContent>
</Card>
```

### 5.3 Props

- Explicit named props. No prop-spreading of unknown objects except when extending a native element:
  `interface Props extends React.ComponentProps<"button"> { … }`
- No `React.FC`. Type the props parameter directly.
- Required by default; optional only when there's a real default.
- Never pass whole domain objects when the component uses two fields — pass the two fields, unless the object is the component's actual subject.

### 5.4 Responsive & the mobile/desktop split

**Default: ONE component, mobile-first, Tailwind breakpoints.** Base styles are mobile; `sm: md: lg:` add complexity upward.

Duplicating into `ThingMobile` / `ThingDesktop` is a **last resort**, permitted only when at least one is true:

1. **Different interaction model** — e.g. bottom sheet vs dropdown, drawer nav vs horizontal nav, swipe vs hover.
2. **Different DOM structure/semantics** — e.g. a data table on desktop vs stacked cards on mobile, where the markup shares nothing meaningful.
3. **Breakpoint conditionals exceed ~30% of the JSX**, making the single component unreadable.

Cosmetic differences (spacing, columns, font size, hiding a label, reordering with `order-*`) are **never** grounds for a split. Use Tailwind.

**When you do split:**

- Both variants live beside a coordinating parent: `nav/nav.tsx`, `nav/nav-mobile.tsx`, `nav/nav-desktop.tsx`.
- **Shared logic goes in a hook**, not copy-paste. Duplicated business logic in two variants is a bug waiting to happen.
- **Switch with CSS, not JS**, when both trees are cheap: `<div className="md:hidden">` / `<div className="hidden md:block">`. This is SSR-safe and causes no layout shift.
- **Switch with JS only when a variant is expensive** (heavy chart, editor, map). Then use `next/dynamic` so the unused one isn't downloaded — and accept that you must render a stable-height skeleton on first paint.
- **Never gate initial render on `window.matchMedia` / `useMediaQuery` for above-the-fold content.** It hydration-mismatches and shifts layout. If you must, render a skeleton of the correct height on the server.
- **Never render both trees eagerly and hide one** if either fetches data or mounts a heavy library. That doubles the work.

### 5.5 Container/presentational

Data fetching lives in the Server Component. Presentational components receive data as props and stay pure and reusable. A component that both fetches and renders complex UI should be split.

---

## 6. Styling — Tailwind + shadcn/ui

- **Tailwind utilities only.** No inline `style={{}}` except for genuinely dynamic values (computed transforms, dynamic dimensions).
- **No arbitrary values when a token exists.** `p-4`, not `p-[16px]`. Extend `tailwind.config` if a real token is missing.
- **No `@apply`** except for a genuinely repeated primitive already extracted as a component. If you're `@apply`-ing, you wanted a component.
- **Never construct class names by string concat.** `` `text-${color}-500` `` is invisible to Tailwind's scanner. Use a lookup map or `cva`.
- **Merge classes with `cn()`** (`clsx` + `tailwind-merge`). Every reusable component accepts `className` and merges it last so callers can override.
- **Variants use `cva`**, matching the shadcn convention already in `components/ui/`.
- **Semantic colour tokens only** — `bg-background`, `text-muted-foreground`, `border-border`. Never hard-code hex or raw palette colours in components; it breaks theming and dark mode.
- **Dark mode is not optional** if the project has it. Every new surface gets checked in both themes.
- **Adding shadcn components:** use the CLI, don't hand-write them. Once added, they are project-owned — modify them intentionally, and note it, since upstream updates won't merge.
- Class order: layout → box model → typography → visual → state/responsive. Let Prettier's Tailwind plugin handle it if installed.

**Minimum responsive floor:** every screen works at 320px wide, has no horizontal scroll, and has touch targets ≥44px.

---

## 7. Data & State

No global mandate — choose per case, in this order. Justify anything below tier 1.

**Tier 1 — Server (default).**
Fetch in Server Components. Mutate with Server Actions. Revalidate with `revalidatePath` / `revalidateTag`. If a feature can be built this way, build it this way.

**Tier 2 — URL state.**
Filters, tabs, pagination, search, sort → `searchParams`. Shareable, back-button-correct, survives reload. Do not put these in `useState`.

**Tier 3 — Local component state.**
`useState`/`useReducer` for UI-only concerns: open/closed, hover, input drafts. Keep it as close to the consumer as possible.

**Tier 4 — Server-cache library** (TanStack Query / SWR).
Only for genuinely client-driven data: polling, infinite scroll, optimistic-heavy flows, realtime. Never use it to re-fetch data a Server Component already has.

**Tier 5 — Global client store** (Zustand/Redux/Context).
Last resort, for cross-tree client state with no server counterpart (theme, command palette, multi-step wizard). **Server data does not belong in a global store.**

### Rules

- **Never lift state "just in case".** Lift on the second real consumer.
- **Context is not a state manager.** Every context value change re-renders all consumers — split contexts by update frequency.
- **Derive, don't sync.** If a value is computable from props/state, compute it. Do not mirror props into state with `useEffect`.
- **`useEffect` is for synchronising with external systems.** Not for data fetching in a Server Component world, not for derived values, not for reacting to prop changes.
- **Validate at the boundary.** Every Server Action and route handler validates input with Zod before doing anything. Never trust client-sent IDs — re-check authorisation server-side.
- Server Actions return typed results (`{ ok: true, data } | { ok: false, error }`); don't throw raw errors at the client.

---

## 8. TypeScript

- `strict: true`. No `any`, no `@ts-ignore` (use `@ts-expect-error` with a comment if truly unavoidable).
- No non-null `!` to silence the compiler — narrow properly.
- Infer types from the source of truth: Zod schemas (`z.infer`), DB schema, API client. Don't hand-maintain parallel types.
- Discriminated unions over optional-field soup for state that has modes.
- Exported functions get explicit return types. Internal ones can infer.
- `satisfies` for config objects to keep literal types.

---

## 9. Performance & Core Web Vitals

**Budgets — treat as failing tests:**

| Metric | Target | Common cause when failing |
|---|---|---|
| LCP | ≤ 2.5s | Unoptimised hero image, client-side data fetch, blocking font |
| INP | ≤ 200ms | Heavy handler, oversized client bundle, unmemoised list |
| CLS | ≤ 0.1 | Missing image dimensions, injected banner, font swap, JS breakpoint switch |
| TTFB | ≤ 800ms | Unbatched/waterfalled server queries, no caching |
| Route JS | ≤ ~170KB gzip | Barrel imports, heavy libs in client components, no code splitting |

### 9.1 Images

- **Always `next/image`.** Never a raw `<img>` for content images.
- Always set `width`/`height` or use `fill` with a sized, `relative` parent. Missing dimensions is the #1 CLS cause.
- Set `priority` on the **LCP image only** (usually the hero). Never on more than one per route — it de-prioritises everything else.
- Always provide `sizes` for `fill` or responsive images, or you ship desktop-sized bytes to phones.
- Prefer AVIF/WebP. Add `placeholder="blur"` for large images.
- Add remote hosts to `images.remotePatterns` — don't disable optimisation to work around it.

### 9.2 Fonts

- `next/font` only. Never a `<link>` to Google Fonts — it adds a render-blocking round trip.
- Subset to the character sets used, `display: "swap"`, and self-host via the loader.
- Two font families maximum per project.

### 9.3 JavaScript

- **Server Components are the primary performance lever.** Zero-JS by default. Every `"use client"` is a bundle cost — this is why Section 4 exists.
- **`next/dynamic` for heavy, below-the-fold, or conditional UI:** charts, editors, maps, modals, date pickers, video players. Add `ssr: false` only when the component genuinely can't render server-side.
- **Import narrowly.** `import { debounce } from "lodash-es"`, never `import _ from "lodash"`. Barrel imports from large libraries pull in the whole package.
- Prefer `date-fns`/`Intl` over `moment`. Prefer the platform (`fetch`, `Intl.NumberFormat`) over a dependency.
- Run the bundle analyser before adding anything to a client component that "feels big".
- Memoise (`memo`/`useMemo`/`useCallback`) **only** for measured problems: long lists, expensive computations, referentially-unstable props to memoised children. Premature memoisation is its own cost.
- Virtualise lists beyond ~100 rows.

### 9.4 Data & caching

- **Parallelise independent fetches** with `Promise.all`. Sequential `await`s in a Server Component are a self-inflicted waterfall.
- **Stream.** Wrap slow, non-critical sections in `<Suspense>` with a correctly-sized skeleton so the shell paints immediately. Never block the whole page on the slowest query.
- `loading.tsx` per route segment.
- Be **explicit about caching** — Next 16 caching is opt-in. Declare intent (`revalidate`, `cache`, tags) rather than relying on defaults, and leave a comment saying why.
- Tag-based invalidation over blunt path revalidation where it fits.
- Never fetch in a `useEffect` what a Server Component could have fetched.

### 9.5 Layout stability

- Reserve space for **everything** async: images, ads, embeds, banners, skeletons.
- Skeletons match the **real** dimensions of what replaces them.
- Never insert content above existing content after load.
- Animate `transform`/`opacity` only. Animating `width`/`height`/`top` triggers layout.
- Respect `prefers-reduced-motion`.

### 9.6 Self-check

Before declaring a UI task done, confirm: LCP element identified and optimised · no unsized media · one `priority` image · no new client-side data waterfall · no large library added to a client bundle · skeletons dimensionally correct.

---

## 10. Forms

- `react-hook-form` + `zodResolver`, with **the same Zod schema reused server-side**. Client validation is UX; server validation is the actual check.
- shadcn `Form` primitives so labels, descriptions, and errors wire up accessibly.
- Every input has a real `<label>` (visible, or `sr-only` when the design demands).
- Disable submit while pending (`useFormStatus`), show a loading state, prevent double submit.
- Inline, specific error messages next to the field. Never a bare "Something went wrong".
- Preserve user input on failure. Never clear a form because the server errored.

---

## 11. Errors, Loading & Empty States

Every data-driven view handles **four** states. A component that only handles "success" is incomplete.

1. **Loading** — skeleton matching final layout (not a centred spinner on a blank page)
2. **Empty** — explains what would be here and offers the action that creates it
3. **Error** — human-readable, with a retry path
4. **Success**

- `error.tsx` per route segment; `global-error.tsx` at root.
- Error boundaries around independently-failing widgets so one dead panel doesn't blank the page.
- **Never swallow errors.** No empty `catch {}`. Log server-side, show something actionable client-side, never surface a stack trace or DB message to users.
- `not-found.tsx` + `notFound()` for missing resources — don't render an empty shell.

---

## 12. Accessibility (baseline — always applies)

- Semantic HTML first. `<button>` for actions, `<a>`/`<Link>` for navigation. Never a clickable `<div>`.
- Keyboard-operable: everything reachable, visible focus rings (never `outline: none` without a replacement), logical tab order, Escape closes overlays, focus trapped in modals and restored on close.
- One `<h1>` per page; don't skip heading levels.
- `alt` on every image — descriptive, or `alt=""` if decorative.
- Colour contrast ≥ 4.5:1 for body text.
- Prefer Radix/shadcn primitives over hand-rolled interactive widgets — they handle ARIA and focus for you.

---

## 13. Security

- Validate and sanitise all input server-side. Never trust the client.
- Authorise on every server action and route handler — do not rely on hidden UI.
- Secrets never in client components, never in `NEXT_PUBLIC_*`, never committed.
- Parameterised queries / ORM only. No string-built SQL.
- Avoid `dangerouslySetInnerHTML`; if unavoidable, sanitise and say why in a comment.
- Don't log tokens, passwords, or PII.
- Keep `proxy.ts` (formerly `middleware.ts`) light — it runs on every matched request. Never treat it as the only auth check.

---

## 14. Git & Delivery

- Conventional Commits: `feat:`, `fix:`, `refactor:`, `perf:`, `chore:`, `docs:`, `test:`.
- Imperative mood, ≤72-char subject, explain **why** in the body.
- One logical change per commit. Never bundle a refactor with a feature.
- Never commit: `.env*`, secrets, `node_modules`, build output, debug logs, commented-out code.
- Never `--force` push a shared branch. Never rewrite others' history.
- Don't disable lint rules or tests to make CI pass. Fix the cause or flag it.

---

## 15. Anti-Patterns — Do Not Do These

- ✗ `"use client"` at the top of a page or layout to avoid thinking about boundaries
- ✗ Duplicating a component for mobile purely for spacing/layout differences
- ✗ `useEffect` + `fetch` for data a Server Component could load
- ✗ Mirroring props into state, or syncing state with `useEffect`
- ✗ Global store as a cache for server data
- ✗ `any`, `@ts-ignore`, `!` to silence the compiler
- ✗ Dynamic Tailwind class strings
- ✗ Hard-coded colours, spacing, or breakpoints outside the config
- ✗ Adding a dependency for something the platform or shadcn already does
- ✗ Barrel-importing a large library into a client component
- ✗ Empty `catch {}`
- ✗ Raw `<img>`, unsized media, multiple `priority` images
- ✗ Sequential awaits for independent data
- ✗ Rewriting unrelated files, reformatting whole files, or "helpfully" upgrading deps
- ✗ Leaving `console.log`, TODOs without context, or dead code
- ✗ Producing large amounts of code from an ambiguous prompt instead of asking

---

## 16. Definition of Done

Do not report a task complete until all of these hold:

- [ ] `<build command>` passes
- [ ] `<typecheck command>` passes with zero errors
- [ ] `<lint command>` passes with zero new warnings
- [ ] `<test command>` passes (and new logic has a test, if the project tests)
- [ ] Works at 320px, 768px, 1280px — no horizontal scroll
- [ ] Loading, empty, error, and success states all handled
- [ ] Keyboard navigable with visible focus
- [ ] Dark mode checked (if applicable)
- [ ] No new `any`, no `console.log`, no dead code
- [ ] No unrelated files modified
- [ ] Section 9.6 performance self-check passes

### Reporting back

State: **what changed** (file list), **why**, **anything you assumed**, and **anything you deliberately left out**. Do not claim you verified something you did not run. If you couldn't run the build, say so.

---

## 17. Commands

```bash
<pkg> dev          # dev server
<pkg> build        # production build
<pkg> start        # serve production build
<pkg> lint         # eslint
<pkg> typecheck    # tsc --noEmit
<pkg> test         # test suite
<pkg> dlx shadcn@latest add <component>
```