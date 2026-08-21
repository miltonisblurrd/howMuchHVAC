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

Then promote Andy to admin after he has a profile:

```sql
update public.profiles set role = 'admin' where email = 'howmuchandy@gmail.com';
```

In Supabase Auth settings, add redirect URLs:

- `http://localhost:3000/auth/callback`
- `https://www.trusthowmuch.com/auth/callback`

## Portal & admin

- **Customer portal:** `/portal/login` — email + password (created on the quote form)
- **Admin:** `/admin/login` — same; requires `profiles.role = 'admin'`
- Forgot password emails a one-time reset link (needs Resend SMTP + `SUPABASE_AUTH_EMAILS=true`)
- Andy can email a password-setup link from Leads or a Job

Quote forms create the portal account with the password the customer chose. Returning visits are email + password — no magic link.

## Vercel env vars

Set these in the Vercel project (Settings → Environment Variables) or the production build of portal/admin will have no database:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL` (production URL)

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
