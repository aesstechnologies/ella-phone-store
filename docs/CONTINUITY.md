# ELLA — Project continuity (for humans & agents)

Use this file after cloning the repo or starting a **new Cursor/agent session**. Chat history is not stored in git.

## Business

| Item | Value |
|------|--------|
| Name | **ELLA — Phone Repair & Store** |
| Email | `ellaphonerepair@gmail.com` |
| GitHub | [aesstechnologies/ella-phone-store](https://github.com/aesstechnologies/ella-phone-store) |
| Deploy target | **Vercel** (not GitHub Pages — needs auth, DB, admin) |
| Backend | **Supabase** (auth, PostgreSQL, Realtime chat, storage) |
| Payments | **Request purchase / contact first**; Stripe wired but disabled |

## Product decisions (locked in)

- **Languages:** English + Spanish (`next-intl`, `/en`, `/es`)
- **UX:** Light, feminine palette; Apple-inspired product configurator; not boring / approachable
- **Fulfillment:** Pick up from store; store delivery + delivery service within admin-configurable **radius (km)**
- **Store address & logo:** Mock defaults; editable in **Admin → Settings** (including logo URL + placeholder URL)
- **Initial catalog:** 7 phones from owner spreadsheet (see `src/lib/data/seed.ts`, `supabase/seed.sql`)
- **Owner admin:** Supabase `profiles.role = 'admin'` for store email after register

## What is implemented (baseline)

- Public: home, shop, product pages, repairs request, contact
- Customer: account dashboard, repairs/orders/messages routes (data from Supabase when connected)
- Admin: dashboard, products list, repairs/orders lists, settings form, messages placeholder
- API: orders, repairs, chat, admin settings, Stripe checkout + webhook **stubs**
- Dev: role switcher (guest / customer / admin) when `NEXT_PUBLIC_DEV_AUTH_ENABLED=true`
- Assets: `public/logo.svg`, `public/logo-placeholder.svg`

## Backlog (priority order)

1. **Supabase in production** — Create project, run `supabase/migrations/001_initial_schema.sql`, seed, env on Vercel, promote owner to admin
2. **Admin product CRUD UI** — Add/edit products and variants (currently list-only + seed)
3. **Admin repair/order actions** — Update status, internal notes, notify customer
4. **Chat admin inbox** — List conversations, reply as admin (Realtime already on `messages`)
5. **Stripe enablement** — Keys, webhook, enable `stripe_enabled` / `NEXT_PUBLIC_STRIPE_ENABLED`, replace request-purchase primary flow
6. **Product images** — Supabase Storage uploads, admin image field
7. **Email notifications** — Repair status, order confirmed (Resend/Supabase edge/etc.)
8. **Custom domain** — After Vercel deploy
9. **Trade-in estimator** — Apple-style flow (future phase from original design refs)

## Local development (fresh machine)

```bash
git clone https://github.com/aesstechnologies/ella-phone-store.git
cd ella-phone-store
npm install
cp .env.local.example .env.local
```

Minimum for **public shop + dev admin/customer preview**:

```env
NEXT_PUBLIC_DEV_AUTH_ENABLED=true
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Run `npm run dev` (uses **webpack** in dev to avoid Turbopack font issues). Use the **yellow dev panel** (bottom-left) to switch Guest / Customer / Admin.

For **real auth**, add Supabase vars to `.env.local` — full steps in [README.md](../README.md).

## Known dev notes

- **Google fonts:** Loaded via `<link>` in `[locale]/layout.tsx` (not `next/font/google`) to avoid Turbopack font module errors
- **Logo:** Plain `<img>` for SVG (not `next/image`) to avoid dev warnings
- **`.env.local`:** Never committed; back up before wiping PC
- **Agent context:** Read this file + README; optional user message: current Supabase/Vercel status and next backlog item

## Session log (high level)

| When | What |
|------|------|
| Initial | Next.js app, i18n, seed products, admin shell, Supabase schema, Stripe stubs, Vercel-oriented README |
| Follow-up | Dev auth bypass, font/logo fixes, README dev mode, this continuity doc |

Update this table when merging significant PRs.
