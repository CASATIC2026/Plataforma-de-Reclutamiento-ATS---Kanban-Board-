# Responsive Design Principles — Talentify Frontend

A single reference for building interfaces that work from **150px to 2560px+** without layout bugs, duplicate Figma frames, or the common **white strip on the right** when resizing.

**Stack:** React 19, Vite 8, Tailwind CSS 4 (`@theme` in `src/index.css`).

---

## Core philosophy

1. **One codebase** — Desktop and mobile Figma frames are visual specs for the **same** components, not two separate pages.
2. **Containers grow. Text stays clamped. Grids add columns.**
3. **Sections bleed full-width. Content inside them is constrained.**
4. **Below 320px, progressively remove** — never shrink text below readable limits.
5. **Fix overflow at the source** — do not rely only on `overflow-x: hidden` to hide layout mistakes.

---

## Viewport zones

Design and test all five zones:

```
150px ─── 240px ─── 320px ─── 768px ─── 1920px ─── 2560px+
  │         │         │         │          │          │
  micro     compact   mobile    desktop    large      ultra
```

| Zone | Width | Behavior |
|------|-------|----------|
| Micro | 150–240px | Single vertical stream; hide non-essential UI |
| Compact | 240–320px | Single column; tight spacing; all content visible |
| Mobile | 320–768px | Full mobile experience; fluid spacing |
| Desktop | 768–1920px | Multi-column layouts; full-bleed sections |
| Large / Ultra | 1920px+ | Content capped; side margins absorb extra space |

**Primary layout breakpoint:** `768px` only. Use `clamp()` and `auto-fit` for everything between breakpoints.

---

## From Figma (PC + mobile) to React

| Figma gives you | Production gives you |
|-----------------|----------------------|
| Desktop frame (~1440px) | Same components at `min-width: 768px` |
| Mobile frame (~390px) | Same components below `768px` |
| Different spacing / type | CSS tokens with `clamp()` |
| Absolute `left` / `top` | Grid and flex only |

**Do not** ship `HeroDesktop.jsx` and `HeroMobile.jsx`. **Do** diff frames once, then implement shared markup with responsive CSS.

### Suggested file structure

```
src/
  styles/
    tokens.css          ← clamp spacing, typography, radii
    responsive.css      ← 768px layout switches + compact/micro tiers
  components/landing/
    LandingSection.jsx  ← full-bleed wrapper + inner container
    LandingNav.jsx
    LandingHero.jsx
    JobSearchBar.jsx
    JobCardGrid.jsx
  pages/
    NewLandingPage.jsx  ← composes sections; minimal inline styles
```

### Section pattern (full-bleed, no “floating page”)

```jsx
function LandingSection({ className, children, as: Tag = 'section' }) {
  return (
    <Tag className={`w-full ${className ?? ''}`}>
      <div className="mx-auto w-full max-w-[min(90vw,1600px)] px-[var(--page-px)]">
        {children}
      </div>
    </Tag>
  );
}
```

- **Outer:** `width: 100%` — background reaches viewport edges.
- **Inner:** `max-width: min(90vw, 1600px); margin: 0 auto` — readable content width.

---

## Design tokens

All visual values should be CSS custom properties. Colors and fonts live in `src/index.css` (`@theme`). Fluid scale lives in `tokens.css`.

### Typography (`clamp`)

```css
:root {
  --text-hero: clamp(20px, 5vw + 10px, 84px);
  --text-h2:   clamp(18px, 3vw + 6px, 42px);
  --text-h3:   clamp(16px, 2vw + 6px, 24px);
  --text-body: clamp(13px, 3.5vw, 16px);
  --text-sm:   clamp(11px, 3vw, 14px);
}
```

- Body text: **13px minimum**, **16px maximum**.
- Paragraphs: `max-width: 72ch`.
- Do **not** use media queries for font size or spacing — use `clamp()`.

### Spacing (`clamp`)

```css
:root {
  --page-px:      clamp(4px, 3vw, 64px);
  --section-gap:  clamp(16px, 5vw, 80px);
  --card-padding: clamp(8px, 2vw, 32px);
  --card-gap:     clamp(8px, 1.5vw, 24px);
  --nav-height:   clamp(44px, 5vw, 80px);
}
```

### Radius and icons

```css
:root {
  --radius-card:       clamp(12px, 2vw, 32px);
  --radius-search-bar: clamp(16px, 2vw, 32px);
  --radius-full:       9999px;
  --icon-size:         clamp(36px, 4vw, 72px);
}
```

---

## Layout rules

### One breakpoint for structure (`768px`)

```css
/* Hero: stacked → two-column */
.hero { grid-template-columns: 1fr; }
@media (min-width: 768px) {
  .hero { grid-template-columns: 7fr 5fr; }
}

/* Nav: hamburger → inline links (links hidden below 768px in CSS; menu via React state) */
.nav-links { display: none; }
@media (min-width: 768px) {
  .nav-links { display: flex; }
  .hamburger { display: none; }
}
```

Use React state for the **mobile nav overlay** (scroll lock, z-index) — not CSS-only show/hide.

### Card grids — zero extra breakpoints

```css
.job-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
  gap: var(--card-gap);
}
```

**Required:** `min(100%, 280px)` — without it, a fixed `minmax(340px, 1fr)` overflows narrow viewports and causes horizontal scroll.

### Search bar

- Mobile: column stack, full-width controls.
- Desktop (`768px+`): row layout.
- Flex children: `min-width: 0` so inputs can shrink.
- Avoid fixed `width: 200px` on selects in the default row layout; use `max-width` + `flex: 0 1 auto`.

### Modals

```css
.modal {
  width: 100%;
  height: 100dvh;
}
@media (min-width: 768px) {
  .modal {
    width: min(90vw, 720px);
    height: auto;
    max-height: 85dvh;
    border-radius: var(--radius-card);
  }
}
```

Use `100dvh`, not `100vh`, on mobile (browser chrome).

### Filter chips

Horizontal scroll when they do not fit — do not wrap into multiple rows on mobile.

```css
.filters {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
```

---

## Progressive collapse (micro viewports)

Below **320px**: compress spacing; hit token minimums.

Below **240px**: hide non-essentials (filters, hero image, footer, extra nav actions). Keep logo, title, essential card fields.

Never shrink body text below **13px** — hide elements instead.

### Landscape phones

```css
@media (max-height: 500px) and (orientation: landscape) {
  .nav { position: relative; }
  .hero-image-wrap { display: none; }
}
```

---

## Avoiding the white box on the right

When narrowing the viewport, a **white (or empty) strip on the right** almost always means **horizontal overflow**: something is wider than the viewport, the document scrolls sideways, and the `body` background shows in the gap.

### Root causes (Talentify landing)

| Source | Problem |
|--------|---------|
| `minmax(340px, 1fr)` on job grid | Grid cannot shrink below 340px + padding |
| `width: 200px` on search `<select>` | Flex row minimum width exceeds viewport between breakpoints |
| Navbar (logo + name + user + buttons) | Flex items without `min-width: 0` or truncation |
| Pagination | Many fixed-width buttons in one row without wrap |
| `overflow-x: hidden` only on a child `<div>` | `html` / `body` still scroll horizontally |
| `width: 100vw` | Includes scrollbar width → extra ~15px overflow |

### Fix order (prefer source fixes over clipping)

1. **Job grid** — use `repeat(auto-fit, minmax(min(100%, 280px), 1fr))`.
2. **Search bar** — `flex: 1 1 0; min-width: 0` on input; flexible select (`max-width`, not fixed `width`).
3. **Section padding** — `clamp(12px, 4vw, 40px)` instead of fixed `40px` horizontal padding on small screens.
4. **Navbar** — `max-width: 100%`; truncate long user names; collapse actions below ~590px.
5. **Pagination** — `flex-wrap: wrap` or `overflow-x: auto` on that row only.
6. **Global safety net** (after fixing widths):

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  max-width: 100%;
  overflow-x: clip;
}
```

Prefer `width: 100%` over `100vw` for full-width sections.

### Debug in DevTools

```js
document.documentElement.scrollWidth - window.innerWidth
// > 0 means overflow

[...document.querySelectorAll('*')]
  .filter(el => el.scrollWidth > document.documentElement.clientWidth)
```

Inspect the widest elements first (grid, search row, navbar, pagination).

---

## What grows vs what stays fixed (large screens)

| Element | Behavior |
|---------|----------|
| Page inner container | `min(90vw, 1600px)` |
| Section backgrounds | Full viewport width |
| Card grid | More columns via `auto-fit` |
| Card padding / radius | `clamp()` up to max |
| Body text | Fixed max 16px, `72ch` line length |
| Hero title | `clamp()` up to ~84px |
| Badges / metadata labels | Fixed size |
| Modals | `min(90vw, 720px)` |

Do **not** set `max-width: 1280px` on `body` or `main` — only on inner content wrappers.

---

## React vs CSS responsibilities

| Use CSS | Use React state |
|---------|-----------------|
| Columns, stacking, spacing | Mobile nav open/close |
| `clamp()`, grids, visibility tiers | Modal open, scroll lock on `body` |
| `auto-fit` card layout | Form steps inside modals |

**Never** use `window.resize` listeners or `innerWidth` for layout — causes flash and SSR hydration issues.

---

## Anti-patterns

1. Multiple layout breakpoints (900, 680, 500) — use **768px** + fluid tokens.
2. Separate desktop/mobile page components from Figma.
3. Fixed pixel container widths (`1280px` on the page root).
4. `minmax(340px, 1fr)` without `min(100%, …)`.
5. Media queries for spacing/font size instead of `clamp()`.
6. Absolute positioning from design tools for layout.
7. CSS-only mobile menu without scroll management.
8. `overflow-x: hidden` as the only fix for overflow.
9. `100vh` for full-screen mobile UI — use `100dvh`.
10. `maximum-scale=1` on the viewport meta tag.

---

## Checklist (new page or refactor)

- [ ] Section wrappers `width: 100%`; inner content `max-width: min(90vw, 1600px)`
- [ ] Spacing and typography use `clamp()` tokens
- [ ] Job/card grids use `auto-fit` + `minmax(min(100%, 280px), 1fr)`
- [ ] Only **one** layout breakpoint at `768px`
- [ ] Compact styles at `max-width: 320px`; micro at `max-width: 240px`
- [ ] Flex children that must shrink have `min-width: 0`
- [ ] No fixed widths that sum wider than the viewport (search row, grid mins)
- [ ] `html` / `body` have `max-width: 100%` and `overflow-x: clip` after width fixes
- [ ] Modals: full viewport mobile, `min(90vw, 720px)` desktop
- [ ] Colors via `@theme` / CSS variables — no hardcoded hex in components
- [ ] Test at **390**, **590**, **768**, **1090**, **1920** (and optionally **300**, **240**)
- [ ] Verify `scrollWidth === clientWidth` at narrow widths (no horizontal scroll)

---

## Talentify-specific notes

- Public landing: `src/pages/NewLandingPage.jsx` + `src/styles/landing.css` — migrate away from many breakpoints and `!important` overrides toward tokens + single breakpoint.
- Shared cards: `JobCardNew` — one card component; grid handles columns; avoid fixed card width.
- Apply flow: `ApplyModal` — responsive modal rules above.
- Admin/Kanban: separate density; same token file and overflow rules apply.
- Legacy README section “Responsive Design (900/680/500)” is **deprecated** in favor of this document.

---

## References

- Original system guide: `RESPONSIVE-DESIGN-GUIDE.md` (full token tables and micro-mode CSS examples)
- Project README: `../../README.md` (features and stack)
- Tokens entry point: `src/index.css` (`@theme`)
