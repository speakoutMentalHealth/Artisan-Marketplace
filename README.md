# Artisan Marketplace MVP

A location-based marketplace for discovering, verifying, hiring and reviewing skilled professionals.

## Current implementation

- Mobile-first public marketplace home
- Category discovery and professional search UI
- Professional profile with verification and reputation signals
- Post-a-job experience
- Professional dashboard and nearby job opportunities
- Admin verification queue
- Supabase/Postgres schema for profiles, professionals, services, jobs, quotes, bookings, payments, reviews, disputes and audit logs\n- Supabase SSR authentication with customer/professional role onboarding\n- Protected account, professional and admin routes\n- Real professional application submission and authenticated job creation
- Row Level Security starter policies
- PostGIS-backed nearby-professional query
- Responsive mobile navigation and desktop admin layouts
- GitHub CI for type-check and production build

> **Working name:** “Artisan Marketplace” is a placeholder. Branding can change without changing the core architecture.

## Stack

- Next.js 16.3.8
- React 19
- TypeScript
- Supabase/Postgres
- PostGIS
- Responsive CSS

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

The current screens use demo data, so the UI renders before a Supabase project is connected.

## Supabase setup

1. Create a Supabase project.
2. Enable PostGIS in a dedicated `extensions` schema.
3. Put the project URL and publishable key in `.env.local`.
4. Apply `supabase/migrations/0001_marketplace.sql` to a development database.
5. Create private storage buckets for verification documents and job evidence before wiring file uploads.
6. Never expose the service-role key to the browser.

## Security decisions represented in the schema

- Verification is separated into phone, identity, certificate, bank and reference checks.
- Exact job addresses are separate from public area names.
- Verification documents have no public-read policy.
- Reviews require a completed booking.
- Payment rows are participant/admin-readable and are intended to be written only by trusted server/webhook code.
- Administrative actions are designed to be auditable.
- Location searches use PostGIS instead of exposing residential addresses.

## Next engineering phase

1. Supabase Auth and automatic profile creation.
2. Professional application wizard.
3. Private verification-document uploads.
4. Admin approval/rejection actions with audit logs.
5. Replace demo discovery with live PostGIS queries.
6. Job creation and matching.
7. Quote submission and transactional acceptance.
8. Payment-provider adapter plus verified, idempotent webhooks.
9. Booking state machine.
10. Messaging, notifications and disputes.
11. Automated RLS/security tests.
12. Production deployment review.

## Production warning

This is a functional MVP foundation, not yet authorization to process real identity documents or money. Authentication flows, private storage policies, payment webhooks, fraud controls, legal terms and production security testing must be completed before public launch.
