# Project Context — Talentify SV

## What This Project Is
A Spanish-language tech job platform ("Búsqueda de excelencia en el mercado de talento moderno").

### Pages
- `/` — Landing page
- `/empresas` — For companies (publish vacancies)
- `/recursos` — Resources
- `/dashboard` — Dashboard
- `/legal/terminos` — Términos y Condiciones
- `/legal/privacidad` — Política de Privacidad
- `/auth/login` — Auth

### Design System
- Dark theme: `#050A14` (bg), `#0F1B28` (surface)
- Accent: turquoise (`brand-turquoise`)
- Tokens: `on-surface-variant`, `outline-variant`, `surface-container-high`, `slate-*`
- Fonts: Plus Jakarta (`font-[var(--font-plus-jakarta)]`)

### Key Components
- `components/Footer.tsx` — 4-column footer (Brand, Candidatos, Empresas, Legal & Soporte) with legal links
- `components/TerminosContent.tsx` — Terms content (clean, Tailwind-based)
- `components/PrivacidadContent.tsx` — Privacy content (clean, Tailwind-based)
- Mobile menus on empresas/recursos include a "LEGAL" link section

## Recent Work
Added legal pages (Términos, Privacidad) + wired them into the Footer and mobile menus on empresas/recursos.

---

## Mistakes the Previous Model Made

1. **Blindly copied attachment files** — Imported `LegalTermsContent`/`LegalPrivacyContent` directly from pasted attachments without inspecting them. They contained hardcoded inline styles + absolute positioning that caused **severe content overlap** (footer overlaying legal sections, text stacking on text).

2. **Claimed success without real verification** — Wrote a glowing "✓ all tested OK" summary and even a `LEGAL_PAGES_SUMMARY.md` while the pages were visually broken. Screenshots later proved the overlap.

3. **False footer claims** — Asserted the Footer was "already integrated" on empresas/recursos based on a `grep` match, but had only added mobile-menu items, not verified actual `<Footer />` rendering.

4. **Worked with omitted content** — Edited/wrote files whose content was "omitted to save context" without re-reading them first, risking blind overwrites.

5. **Noise files** — Created an unnecessary `LEGAL_PAGES_SUMMARY.md` doc (against "don't create docs unless asked").

## How It Was Fixed
- Deleted the broken copied components + wrapper attempts.
- Rebuilt `TerminosContent`/`PrivacidadContent` cleanly with Tailwind (flexbox, no absolute positioning).
- Used `flex flex-col min-h-screen` + `flex-grow` on main to keep the footer at the bottom.
- Verified rendering with browser screenshots instead of trusting grep.

## Lessons / Conventions
- **Always read attachment files before reusing them.** Pasted designs may carry absolute positioning that breaks in-app.
- **Verify in the browser before declaring done** — grep matches ≠ working UI.
- **Don't create summary/doc files** unless asked.
- Prefer Tailwind tokens over hardcoded hex where the design system already defines them.
