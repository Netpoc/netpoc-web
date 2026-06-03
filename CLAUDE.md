# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack & Commands

Vue 3 (`<script setup>` + TypeScript) · Vite 8 · Vue Router · Tailwind CSS v4 (Vite plugin) · `@vueuse/core` + `@vueuse/motion`.

```bash
npm install        # install deps
npm run dev        # Vite dev server (HMR)
npm run build      # vue-tsc type-check (-b) then vite build → dist/
npm run preview    # serve the production build locally
npm run type-check # vue-tsc --noEmit, no build
npm run lint       # eslint --fix over .vue/.ts/.tsx
```

There is no test runner yet. If you add one, Vitest + `@vue/test-utils` is the natural fit for this stack — wire it into a `test` script and document how to run a single test here.

## The Company & The Task

**Netpoc Inc Limited** is an African tech company working in System Design, System on Chip, IoT, Software Development, USSD Solutions, Telematics, and Agric Tech.

The goal is a **world-class corporate website** with these defining requirements:
- **Framework**: Vue.js
- **Aesthetic**: Glassmorphism, with **Nsibidi-themed patterns** and **Ankara fabric patterns/themes** woven into the visual design
- **Feel**: Responsive, "techie," and interactive — rich transitions, animations, micro-interactions, scroll effects

Nsibidi is an indigenous West African (notably Igbo/Cross River) ideographic writing system; Ankara is a vibrant West African wax-print fabric. Both are central to the brand identity — treat them as first-class design inputs, not decoration added at the end.

## Resources (`/Resource`)

- `nsibidi dictionary.pdf` — Nsibidi symbol reference. Read this to source authentic ideographs for patterns, section dividers, iconography, and background motifs. (Large file — read targeted page ranges, not the whole PDF.)
- `Netpoc.png` — logo for light backgrounds
- `Netpoc_White.png` — logo for dark/colored backgrounds
- `Icon (1).png` — app/favicon icon

These are the *source* assets. The app consumes copies (do not reference `/Resource` from code): logos live in `src/assets/brand/` (`netpoc-white.png`, `netpoc-dark.png`) and the favicon at `public/icon.png`.

## Skills

Use these skills for the corresponding work — they carry detailed rules and process:

- **`frontend-design`** (`~/.agents/skills/frontend-design`) — distinctive, production-grade UI. Avoid generic "AI slop" aesthetics (no Inter/Roboto/Arial, no purple-on-white clichés). Commit to a bold, cohesive direction. **Invoke this for any component/page/visual work.**
- **`fullstack-developer`** (`~/.agents/skills/fullstack-developer`, also `skills/FULLSTACK.md`) — app architecture, APIs, data, deployment.
- **`ux-designer`** (`skills/ux-designer/`) — research, IA, interaction design, accessibility. See `skills/ux-designer/AGENTS.md` for the compiled ruleset and `skills/ux-designer/rules/` for deep dives. Priority order: User Needs → Accessibility → Usability → Visual Hierarchy → Consistency.
- **`debugger`** (`skills/DEBUGGER.md`) — systematic root-cause analysis when things break.

## Architecture

The design system is the spine of this codebase — most work flows through it rather than around it.

- **`src/style.css`** — the single source of design truth. Tailwind v4 `@theme` tokens define the palette (African-night surfaces `--color-void/night/...`, Ankara accents `--color-saffron/coral/terracotta/emerald/violet/indigo`), fonts (`--font-display` Bricolage Grotesque, `--font-sans` Manrope, `--font-mono` Space Mono), and motion easing. Component classes `.glass` / `.glass-strong` (the glassmorphism primitive), `.text-ankara`, `.pill`, and the `.reveal`/`.is-visible` scroll-reveal utility live here. **Change tokens here, not in components.** The global `prefers-reduced-motion` reset also lives here.
- **`src/components/`** — reusable building blocks:
  - `NsibidiPattern.vue` / `AnkaraPattern.vue` — SVG `<pattern>` background fields (props: `opacity`, `scale`, `color`). The Nsibidi glyphs are *stylised placeholders*; see the design note in that file and the guardrail below.
  - `GlassCard.vue` — the frosted-panel primitive (`interactive` prop adds hover lift/glow).
  - `SiteNav.vue` / `SiteFooter.vue` — global chrome, rendered once in `App.vue` (outside `<RouterView>`).
- **`src/App.vue`** — fixed ambient `.aurora` glow layer (`z-index: -1`), nav, the `<RouterView>` with an `out-in` page `<Transition>`, and footer.
- **`src/views/`** — one component per route: `HomeView`, `ServicesView`, `AboutView`, `ContactView` (Home is eager-loaded in the router; the rest are lazy `import()`).
- **`src/router/index.ts`** — routes + `scrollBehavior` (handles hash anchors like `/services#soc` with a 96px offset for the fixed nav) + an `afterEach` that sets `document.title` from each route's `meta.title`.
- **`src/composables/useReveal.ts`** — `useReveal(rootRef)` wires an `IntersectionObserver` that adds `.is-visible` to any `.reveal` element inside `rootRef` as it scrolls into view. Each view holds a `ref` on its root element and calls this; stagger reveals with inline `transition-delay`.

**Scroll-reveal pattern**: put `class="reveal"` on anything that should animate in, ensure its view calls `useReveal(root)` with a `ref` bound to the view's outer element, and the CSS in `style.css` does the rest.

`@` is aliased to `src/` (in both `vite.config.ts` and `tsconfig.app.json`) — import as `@/components/...`.

## Design Guardrails

- **Authenticity over pastiche**: Nsibidi symbols carry meaning. The glyphs in `NsibidiPattern.vue` today are *stylised, geometry-driven placeholders* — a known follow-up is to replace them with authentic ideographs sourced from `Resource/nsibidi dictionary.pdf`, respecting each symbol's significance. When in doubt, cross-reference the dictionary rather than inventing glyphs.
- **Glassmorphism + Ankara tension**: glass surfaces are translucent and restrained; Ankara is dense and saturated. Layer them intentionally (e.g. Ankara/Nsibidi pattern fields behind frosted glass panels) so neither overwhelms readability.
- **Performance & a11y are not optional**: animation-heavy and responsive both required. Respect `prefers-reduced-motion`, maintain WCAG contrast over busy patterned backgrounds, and keep pattern assets optimized.
