# Fitness4All CRM Project State

Last updated: 2026-04-16

## Current app status

This repository is a live Next.js CRM for Fitness4All with these working areas:

- Authenticated login flow
- Dashboard
- Contacts and contact detail pages
- Opportunities and opportunity detail pages
- Tasks
- Inbox and conversation threads
- Schedule and appointment reminders
- Meta lead intake UI and webhook ingestion
- Automations workspace
- Manual automation execution
- Scheduled automation execution with Vercel cron
- Activity and audit history
- Role-aware route and action permissions

Payment processing is intentionally out of scope.

## Important routes

- `/login`
- `/dashboard`
- `/contacts`
- `/contacts/[id]`
- `/opportunities`
- `/opportunities/[id]`
- `/inbox`
- `/inbox/[id]`
- `/schedule`
- `/meta`
- `/automations`
- `/activity`
- `/api/login`
- `/api/webhooks/meta`
- `/api/automations/run`
- `/api/demo`

## Login credentials

Seeded demo users:

- `admin@fitness4allcrm.com`
- `manager@fitness4allcrm.com`
- `rep@fitness4allcrm.com`

Password for all:

- `fitness4all123`

## Environment variables

Required:

- `DATABASE_URL`
- `AUTH_SECRET`

Optional / recommended:

- `POSTGRES_URL`
- `POSTGRES_URL_NON_POOLING`
- `META_VERIFY_TOKEN`
- `CRON_SECRET`

Current shared secrets that were used in setup:

- `AUTH_SECRET`: `f4a_auth_2026_G7mQ9pL2xV8rK4nT1zY6cH3wB5sJ0dN`
- `CRON_SECRET`: `f4a_cron_2026_K9vR2mQ8xT5nL1pZ7cH4wB6sD3jY0aE`

## Important implementation notes

### Auth and login

- Login page exists at `src/app/login/page.tsx`
- Login handler exists at `src/app/api/login/route.ts`
- Session and seeded auth logic live in `src/lib/auth.ts`
- Middleware protection lives in `middleware.ts`
- Shared permission model lives in `src/lib/permissions.ts`
- Forbidden page exists at `src/app/forbidden/page.tsx`

### Data layer

- Main persistence logic is in `src/lib/db.ts`
- App prefers Postgres URLs in this order:
  - `POSTGRES_URL_NON_POOLING`
  - `POSTGRES_URL`
  - `DATABASE_URL`
- `prisma://` URLs are ignored for the runtime DB client
- If Postgres is slow/unavailable, the app fails open to file-backed storage
- File fallback path is `data/crm.json` or `/tmp/fitness4all-crm.json`

### PWA / browser caching

- We had a service worker caching issue that caused stale 404 and login behavior
- Cleanup logic is in:
  - `src/components/pwa-provider.tsx`
  - `public/sw.js`

### Automations

- Automation templates, enrollments, runs, and execution logic live in `src/lib/crm.ts`
- Manual execution is available from `/automations`
- Scheduled execution runs through `/api/automations/run`
- Vercel cron config is in `vercel.json`
- Cron schedule is every 5 minutes
- If `CRON_SECRET` is set, the runner endpoint requires:
  - `Authorization: Bearer <CRON_SECRET>`

### Activity / audit history

- Activity records are persisted in `src/lib/db.ts`
- Activity creation logic is in `src/lib/crm.ts`
- Activity appears on:
  - `/dashboard`
  - `/contacts/[id]`
  - `/activity`

## Recent important commits

- `5e5d31b` Add Meta lead intake workflow
- `fc74256` Add automation workspace and live enrollments
- `8e2faf8` Execute queued automation steps
- `4684e44` Run due automations on Vercel cron
- `22ce6ec` Add CRM activity audit trail
- `TBD after current session` Add role-aware CRM permissions

## Known operational history

- Main domain and preview URL behavior diverged during Vercel setup
- Browser site data / stale service worker caused false 404 behavior on `/login`
- Login POST worked before dashboard loading was fixed
- Dashboard hangs were traced to Postgres runtime behavior and mitigated with a timeout and fallback

## Best next steps

Recommended next implementation targets:

1. Real provider integrations for Meta messaging, SMS, and email
2. Visual workflow builder and editable automation templates
3. Stronger permissions and role-aware access controls
4. Better reporting and lead-source analytics
5. Multi-location admin and branch-level visibility

## If a future Codex session starts cold

Start by reading:

1. `PROJECT_STATE.md`
2. `README.md`
3. `src/lib/db.ts`
4. `src/lib/crm.ts`
5. `src/app/automations/page.tsx`
6. `src/app/activity/page.tsx`

Then run:

```bash
pnpm lint
pnpm build
```
