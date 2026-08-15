# ELLA — Phone Repair & Store

A bilingual (English / Spanish) web store and repair tracking platform for **ELLA — Phone Repairments and Store**.

Built with **Next.js**, **Supabase**, and **Vercel**. Purchase flow uses **request purchase / contact us** for now, with **Stripe provisions** ready to enable.

## Features

- **Shop** — Apple-inspired product pages with storage, condition, and fulfillment options
- **Repairs** — customers request repairs and track status
- **Accounts** — sign up, view orders and repairs
- **Admin** — manage products, prices, store address, logo URLs, delivery options
- **Chat** — customer ↔ store messaging (Supabase Realtime)
- **i18n** — English and Spanish
- **Fulfillment** — pick up from store, store delivery, or delivery service (radius configurable)

## Quick start (local)

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the app works with **seed data** even before Supabase is configured.

## Supabase setup

### 1. Create a project

1. Go to [supabase.com](https://supabase.com) and sign up (free tier)
2. Click **New project**
3. Choose a name (e.g. `ella-phone-store`), set a database password, pick a region close to your customers
4. Wait for the project to finish provisioning (~2 minutes)

### 2. Get API keys

In your Supabase dashboard:

1. Go to **Project Settings** → **API**
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (keep secret, server-only)

Add them to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### 3. Run the database schema

1. In Supabase dashboard, open **SQL Editor**
2. Paste and run `supabase/migrations/001_initial_schema.sql`
3. Optionally run `supabase/seed.sql` to load the starter product catalog

### 4. Enable email auth

1. Go to **Authentication** → **Providers**
2. Ensure **Email** is enabled
3. Under **Authentication** → **URL Configuration**, set:
   - **Site URL**: `http://localhost:3000` (or your Vercel URL later)
   - **Redirect URLs**: add `http://localhost:3000/**` and your production URL

### 5. Create the store owner (admin)

1. Run the app and register at `/en/auth/register` with `ellaphonerepair@gmail.com` (or your owner email)
2. In Supabase **SQL Editor**, run:

```sql
update public.profiles
set role = 'admin'
where id = (
  select id from auth.users where email = 'ellaphonerepair@gmail.com'
);
```

3. Sign out and back in — you should see **Admin** in the header

### 6. Realtime (chat)

Realtime is enabled in the migration for the `messages` table. Verify under **Database** → **Replication** that `messages` is listed.

## Vercel deployment

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import `aesstechnologies/ella-phone-store`
3. Add environment variables (same as `.env.local`)
4. Deploy

Update Supabase **Site URL** and **Redirect URLs** to your Vercel domain (e.g. `https://ella-phone-store.vercel.app`).

## Store settings (admin)

After logging in as admin, go to **Admin → Settings** to edit:

| Setting | Description |
|---------|-------------|
| Store name & taglines | EN + ES |
| Business email | Default: `ellaphonerepair@gmail.com` |
| Store address | Mock address pre-filled; edit for real location |
| Logo URL | Default: `/logo.svg` — upload custom logo to Supabase Storage and paste URL |
| Logo placeholder | Default: `/logo-placeholder.svg` |
| Delivery radius (km) | Default: 15 km |
| Store delivery / delivery service | Toggle fulfillment options |

## Stripe (backlog — provisions in place)

Stripe is **disabled by default**. Infrastructure is ready:

| File | Purpose |
|------|---------|
| `src/lib/stripe/index.ts` | Stripe client, feature flag |
| `src/app/api/checkout/route.ts` | PaymentIntent creation when enabled |
| `src/app/api/webhooks/stripe/route.ts` | Webhook handler |
| Admin settings | `stripe_enabled` toggle (UI disabled until ready) |

To enable later:

1. Create a [Stripe](https://stripe.com) account
2. Add keys to Vercel env: `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`
3. Set `NEXT_PUBLIC_STRIPE_ENABLED=true` or enable in store settings
4. Point Stripe webhooks to `https://your-domain.com/api/webhooks/stripe`

## Project structure

```
src/
├── app/[locale]/     # Pages (en, es)
├── app/api/          # Orders, repairs, chat, checkout, webhooks
├── components/       # UI, shop, admin, chat
├── lib/              # Supabase, Stripe, data queries
├── i18n/             # next-intl routing
└── types/            # TypeScript types
supabase/
├── migrations/       # Database schema + RLS
└── seed.sql          # Starter products
public/
├── logo.svg          # ELLA brand logo
└── logo-placeholder.svg
```

## Tech stack

- **Next.js 16** (App Router)
- **Tailwind CSS 4**
- **next-intl** — i18n
- **Supabase** — Auth, PostgreSQL, Realtime, Storage
- **Stripe** — prepared, not active
- **Vercel** — hosting

## Business contact

**Email:** ellaphonerepair@gmail.com

---

Built by [AESS Technologies](https://github.com/aesstechnologies).
