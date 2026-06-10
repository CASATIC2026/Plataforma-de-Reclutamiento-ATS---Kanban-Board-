# Payment Integration Proposals

## Context
Recruiters and Managers without a linked company (`EmpresaId = null`) are blocked from
creating job posts. The platform returns `402 empresa_required`. The plans page (`/precios`)
is the redirect target — it needs a real payment path.

---

## Option A — Stripe Payment Links (≈ 30 min)
**No frontend code. Minimal backend.**

1. Create a Payment Link in the Stripe Dashboard (dashboard.stripe.com → Payment Links).
2. Append `?client_reference_id={userId}` to the link URL before redirecting.
3. Add one webhook endpoint `POST /api/webhooks/stripe`:
   - Event: `checkout.session.completed`
   - Action: read `client_reference_id` → create `Empresa` → assign user → mark active.

**Pros:** Almost no code, Stripe handles everything.  
**Cons:** Passing user ID via URL param is clunky; no session control.

---

## Option B — Stripe Checkout Session (≈ 2–3 h) ✅ Recommended long-term
**Proper automated integration.**

1. Backend: `POST /api/pagos/checkout` — creates a Stripe Checkout Session with
   `metadata.userId` and returns `{ url }`.
2. Frontend: redirects the user to the Stripe-hosted payment page.
3. Backend webhook `POST /api/webhooks/stripe`:
   - Event: `checkout.session.completed`
   - Action: read `metadata.userId` → create `Empresa` → assign user to plan tier.
4. Success redirect back to `/dashboard` with a banner: "¡Pago exitoso! Tu cuenta ya está activa."

**Pros:** Fully automated, no manual steps, proper metadata, supports subscriptions later.  
**Cons:** Requires Stripe account approval + registered business entity in SV (can take days).

---

## Option C — Contact / Manual Activation (≈ 1 h) ✅ Recommended NOW
**Zero payment processor. Unblocks real demos immediately.**

1. `NoPlanModal` "Contactar al equipo" button → opens WhatsApp or mailto link.
2. Platform admin receives the request, manually creates an `Empresa` in the DB
   and assigns the user via the `/platform/companies` panel.
3. User re-logs in to get a fresh JWT with `company_id` populated.

**Pros:** Zero risk, zero fees, works today.  
**Cons:** Not automated — does not scale beyond a handful of clients.

---

## Suggested Roadmap

| Phase | Action |
|---|---|
| Now | Ship Option C (contact gate) to enable demos |
| Month 1 | Register business + open Stripe account |
| Month 2 | Implement Option B (Checkout Session + webhook) |
| Later | Add subscription management, plan tiers, invoicing |

---

## Technical Notes
- The `402 empresa_required` response is already implemented in `VacantesController.cs`.
- `NoPlanModal` redirects to `/precios` — just wire the CTA button to the checkout flow when ready.
- Webhook endpoint must be excluded from CSRF and CF Access middleware.
- Stripe webhook secret should be stored in `.env` as `STRIPE_WEBHOOK_SECRET`.
