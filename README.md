# How Much? Website

Next.js + MDX marketing site with a **live Supabase client portal** and **admin ops console** for How Much? Air & Home Improvements.

## Develop

```bash
npm install
cp .env.example .env.local   # fill Supabase / Resend / Stripe
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database

Run migrations in the Supabase SQL Editor (in order):

1. `supabase/migrations/001_leads.sql`
2. `supabase/migrations/002_portal.sql`

Then promote Andy to admin after his first magic-link sign-in:

```sql
update public.profiles set role = 'admin' where email = 'andy@trusthowmuch.com';
```

In Supabase Auth settings, add redirect URLs:

- `http://localhost:3000/auth/callback`
- `https://www.trusthowmuch.com/auth/callback`

## Portal & admin

- **Customer portal:** `/portal/login` — magic link (auto-invited on quote submit)
- **Admin:** `/admin/login` — magic link; requires `profiles.role = 'admin'`
- Andy can **resend invites** from Leads or a Job (especially after scheduling)

## Content

- Blog MDX: `src/content/blog`
- FAQ MDX: `src/content/faqs`
- Brand kit (source PDFs): `../brand-kit`

## Key routes

| Route | Purpose |
|-------|---------|
| `/` | Home |
| `/get-a-quote` | Quote landing (ads + SEO; `/ads` redirects here) |
| `/booking` | Quote / booking wizard |
| `/services` | HVAC services |
| `/service-areas` | City SEO pages |
| `/projects` | Case studies |
| `/reviews` | Reviews + Google deep-link flow |
| `/brand` | Brand guidelines & social examples |
| `/portal` | Client portal (jobs, messages, docs, pay) |
| `/admin` | Ops console (leads, jobs, schedule, invoices) |
| `/api/stripe/webhook` | Stripe Checkout completion |
