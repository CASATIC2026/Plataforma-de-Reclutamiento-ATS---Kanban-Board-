# Talentify SV — Frontend Rendering & Responsiveness Audit

**Date:** 2026-06-04
**Scope:** recruitment-frontend after v0 turquoise-dark redesign (Phase 1 public pages + Phase 2 auth).
**Environment:** API `http://localhost:5223` (200 on `/api/vacantes`), frontend `http://localhost:5173` (CORS-allowed origin). All 9 routes opened in a real Chromium tab and tested at **320 / 590 / 768 / 1280px** via CDP device metrics + JS overflow probes (`scrollWidth − innerWidth`).
**Dataset note:** 1 active vacancy ("Vendedor de papas"), so pagination (`totalPages > 1`) could not be exercised live; pagination logic was verified by code reading.

---

## Summary — PARTIAL PASS

Visual rendering and responsiveness are genuinely solid: **zero horizontal overflow at any breakpoint on any route**, the redesign looks polished, and the public/auth flows are correctly wired. However, the audit surfaced **two real, verifiable defects** (broken sticky navigation across the whole app, and inverted "new/urgent" badge logic) and **one scope deviation** the brief assumed wouldn't exist (the admin UI has been re-skinned to dark turquoise).

The v0remake "false done" / overlap lessons largely held: **no text stacking or footer overlap** was observed on legal pages or modals.

---

## Critical issues (blocks release)

None that hard-break a page render. The two items below are the highest priority and are arguably release-blocking depending on your bar — listed as Major.

---

## Major issues (UX broken)

### M1 — Sticky nav/header never sticks on any page (systemic)
- **Routes/viewports:** all public routes (`/`, `/empresas`, `/recursos`, `/legal/*`) at every width, plus `/admin/*`.
- **Evidence:** at `scrollY = 500` on `/`, the `header.sticky` `getBoundingClientRect().top = -500` (scrolls away instead of pinning). Same on `/legal/terminos` (nav `top -400`, legal header `top -320`) and `/admin/vacantes` (nav `top -120` at scrollY 120).
- **Root cause:** `LandingNav` is `sticky top-0 z-50`, but its scroll ancestor `.public-theme` sets `overflow-x: hidden`. An ancestor with non-visible overflow becomes the sticky containing block and breaks viewport pinning. Identical pattern on `.admin-theme` (`overflow-x: hidden` on `MainLayout`/`PlatformLayout` root) and the page-level `overflow-x-hidden` wrappers.
- **Impact:** the navbar (declared sticky with a drop shadow), the legal `PublicPageHeader`, and the `/recursos` sticky filter bar all scroll out of view. The brief explicitly lists "sticky header" for legal pages and "Sticky/fixed: LandingNav" — both FAIL.
- **Note:** `docs/RESPONSIVE-PRINCIPLES.md` itself prescribes `overflow-x: clip` (not `hidden`) precisely to avoid this.

### M2 — `isRecent()` is inverted → every job shows a "Nuevo" badge
- **Route/viewport:** `/` job cards + `JobDetailModal`, all widths. Verified visually: "Vendedor de papas" is "Publicado: Hace 2 semanas" yet renders the **NUEVO** badge.
- **Root cause** in `recruitment-frontend/src/utils/vacanteHelpers.js`:

```js
export function isRecent(isoString) {
  return new Date(isoString) - new Date() < 2 * 24 * 60 * 60 * 1000;
}
```

`(past) − (now)` is always negative, which is always `< 2 days`, so `isRecent()` returns `true` for every job with a valid date. `deriveBadge()` then tags any job ≥12h old as `'new'` and `mapVacante().urgent` is always `true`. The "new / urgent from createdAt" requirement is effectively non-functional.

### M3 — Admin UI re-skinned to dark turquoise (contradicts "admin unchanged" scope)
- **Route:** `/admin/vacantes` renders on a dark navy `#071326` background with turquoise accents — not the original light "coral" theme the brief assumed.
- **This is intentional**, per the file header in `recruitment-frontend/src/styles/admin-theme.css`:

  > "This converts the bulk of the admin UI to the dark turquoise palette without touching the public/candidate .public-theme."

- **Theme isolation itself is correct:** `.public-theme` is not present on admin routes (`hasPublicTheme: false`); admin uses its own scoped `.admin-theme` that re-maps the `@theme` tokens. So there is **no `.public-theme` bleed**. Flagging because the plan said "public + auth only; admin unchanged" — confirm this dark admin redesign is in-scope.

---

## Minor / polish

- **Redundant double header on legal pages.** `/legal/*` render inside `PublicLayout` (global `LandingNav`) and add their own `PublicPageHeader` ("Volver al inicio" + logo). Two stacked bars at the top; not an overlap, just redundant.
- **Desktop/mobile dual-markup duplication** (anti-pattern `RESPONSIVE-PRINCIPLES.md` warns against). `RecursosPage` ships separate desktop hero/grid/newsletter and mobile hero/list/newsletter; `TerminosContent` renders each section twice (confirmed in the a11y tree — every heading appears 2×). One copy is CSS-hidden, but it duplicates headings (SEO/a11y noise) and doubles maintenance. `LegalPrivacidadPage` does not have this (single responsive layout) — good reference.
- **Placeholder/dead buttons:** `QuickFilters` mobile "Todos los filtros" (SlidersHorizontal) has no `onClick`; `/recursos` "Explorar Guías", "Leer Artículo", "Descargar guía", and the article cards don't navigate; newsletter "Suscribirme" only clears the field; login "¿Olvidaste tu contraseña?" is intentionally disabled (`title="Próximamente"`); OAuth Google/LinkedIn are `disabled` placeholders. Likely intentional, but confirm.
- **Nav cramped at exactly 768px:** desktop links appear but "Talentify SV" and "Iniciar sesión" wrap to two lines in the ~768–820px band. Fine at 1280.
- **`/recursos` off-theme palette:** uses salmon/coral `#D97862` + `#DBC1BB` hardcoded hex (CTAs, body text) instead of the turquoise theme tokens — inconsistent with the rest of the public theme and violates the "colors via tokens, no hardcoded hex" rule.
- **`--font-display` mismatch:** in `index.css` the global `--font-display` is `'Playwrite IE'`, not Plus Jakarta. Plus Jakarta is only applied via `.public-theme .font-display` / `.admin-theme .font-display`. Public/auth/admin headings get Plus Jakarta correctly, but any `font-display` usage outside those scopes would render a cursive fallback.

---

## Verified OK

- **No horizontal overflow** at 320/590/768/1280 on every route (`scrollWidth − innerWidth ≤ 0`). The only "wide" elements are intentional: overflow-x:auto filter rows (`no-scrollbar`) and decorative blur blobs clipped by `overflow-hidden`.
- **Landing:** `getVacantes()` load, search + department + contract-chip filtering, "Limpiar filtros" empty state, grid responsive 1→2 (sm)→3 (lg) cols, hero image correctly hidden < md, grid/list toggle hidden < sm (intentional), pagination touch targets 36–48px.
- **Apply flow:** job card → `JobDetailModal` → "Aplicar" → all 4 ApplyModal steps walked. Step-1 validation blocks empty submit with inline errors; progress bar matches step (1✔2✔3✔4); back/next work; screening step correctly shows CV + availability with no screening questions (this vacancy has none); step-4 review shows persisted data + consent + signature + wired `createPostulacionStructured` submit. (Did not submit, to avoid writing test data — read-only audit.)
- **Modals:** Escape closes (`body.overflow` reset confirmed), backdrop click closes, body scroll lock on open.
- **Mobile nav:** hamburger opens right-side sheet, scroll lock active (`body.overflow:hidden`), close button + backdrop work.
- **Auth:** login required-field validation; register validation, password strength ("Fuerte" green bars for `Abcd1234!`), terms checkbox, role select (Candidate/Recruiter/Manager); tab switch updates URL (`?mode=register`) and panel copy; valid admin login → redirect (admin has `platform:access` → `/platform`); split panel side-by-side at lg, stacked at mobile, no double scroll, no footer covering the form.
- **Theme isolation:** no turquoise/`.public-theme` bleed into `/admin` — admin uses a separate `.admin-theme` scope. `/login` (outside `PublicLayout`) uses its own `.public-theme` wrapper and is color-consistent with the public pages.
- **Legal pages:** scrollable content, TOC sidebar, no text stacking/overlap, no footer overlap, readable line length at mobile.
- No React error overlays or failed renders observed; audited API calls succeeded (`/api/vacantes` 200, login 200). 30s polling did not disrupt filters/pagination during testing.

---

## Recommended fixes (priority P0–P2)

1. **P0** — `recruitment-frontend/src/utils/vacanteHelpers.js` `isRecent()`: flip the comparison to `Date.now() - new Date(isoString).getTime() < 2*24*60*60*1000` so badges reflect real age.
2. **P0/P1** — `recruitment-frontend/src/styles/public-theme.css` (line 9) and `admin-theme.css`: change `overflow-x: hidden` → `overflow-x: clip` (and the page-level `overflow-x-hidden` wrappers) to restore `position: sticky` for nav/headers/filter bar.
3. **P1** — Confirm intent of the dark `admin-theme` redesign (`recruitment-frontend/src/styles/admin-theme.css`); the brief assumed admin stays light.
4. **P1** — `recruitment-frontend/src/components/legal/PublicPageHeader.jsx`: remove the redundant second header (or hide `LandingNav` on `/legal/*`) so there's one top bar.
5. **P2** — Collapse desktop/mobile dual markup in `RecursosPage.jsx` and `TerminosContent` to single responsive components (mirror `LegalPrivacidadPage`).
6. **P2** — Wire or hide placeholder buttons (`QuickFilters` "Todos los filtros"; `/recursos` article/CTA buttons).
7. **P2** — Move `/recursos` hardcoded salmon hex to theme tokens; reconcile global `--font-display` (`index.css`) with Plus Jakarta.

---

## Per-route results

| # | Route | Result | Notes |
|---|-------|--------|-------|
| 1 | `/` (landing) | PASS (minor) | No overflow 320–1280; filters/search/grid/pagination wired; sticky nav broken (M1); all jobs badged "Nuevo" (M2) |
| 2 | `/` job → modal → apply | PASS | Detail modal + 4-step ApplyModal, validation, progress bar, Escape/backdrop, scroll lock all OK |
| 3 | `/empresas` | PASS | Hero/stats/feature cards/steps/CTA; cards 3→1 col; decorative blob clipped, no overflow |
| 4 | `/recursos` | PASS (polish) | Filters + search work; dual desktop/mobile markup; off-theme salmon palette; placeholder CTAs |
| 5 | `/legal/terminos` | PASS (polish) | No overlap; double header; sticky header broken (M1); content duplicated 2× in DOM |
| 6 | `/legal/privacidad` | PASS | No overlap; single responsive layout (no duplication); sticky header broken (M1) |
| 7 | `/login` | PASS | Split panel, validation, OAuth disabled placeholders, theme consistent |
| 8 | `/login?mode=register` | PASS | URL sync, password strength, terms, role select, validation |
| 9 | `/admin/vacantes` | PASS w/ caveat | No `.public-theme` bleed; but admin intentionally dark turquoise (M3); own sticky nav also broken |
