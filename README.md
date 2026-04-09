# Fitness4All CRM

A production-oriented CRM foundation for gym sales teams, tailored to Fitness4All and modeled on the parts of the GoHighLevel product surface that matter most here: CRM, pipelines, inbox, Meta integrations, booking, reminders, workflows, campaigns, reputation, reporting, and AI assist.

Payment processing is intentionally out of scope in this implementation.

The app is also configured as a PWA so it can be installed on phones and desktops after deployment over HTTPS.

## What is implemented

- A working CRM app for:
  - authenticated dashboard access
  - contacts and lead records
  - opportunities and pipeline movement
  - contact/deal tasks
  - unified inbox conversations
  - appointment scheduling and reminder tracking
  - Meta lead intake
  - workflow automation enrollments and execution
- Typed domain models for:
  - contacts
  - opportunities
  - conversations
  - reminder rules
  - workflow templates
  - forms
  - permissions
- Provider abstraction contracts for messaging, social, calendar, email, telephony, and reviews
- API stubs for:
  - demo data at `/api/demo`
  - Meta webhook verification and ingestion at `/api/webhooks/meta`
- Automation runner:
  - due automation execution at `/api/automations/run`
  - Vercel cron schedule in `vercel.json`
- PWA support:
  - web app manifest
  - service worker
  - install prompt
  - app icons

## Environment variables

Required for hosted persistence and auth:

- `DATABASE_URL`
- `AUTH_SECRET`

Optional but recommended:

- `POSTGRES_URL`
- `POSTGRES_URL_NON_POOLING`
- `META_VERIFY_TOKEN`
- `CRON_SECRET`

When `CRON_SECRET` is set, calls to `/api/automations/run` must include an
`Authorization: Bearer <CRON_SECRET>` header.

## Run locally

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Access from anywhere

To make the CRM viewable anywhere by anyone, deploy it to a public host such as Vercel:

```bash
pnpm build
```

Then connect the repo to Vercel or run a production deployment from your preferred host. Once the site is live over HTTPS, users can open it in a browser or install it as an app.

## Suggested next steps

1. Wire real providers for Meta, Twilio, email, Google Calendar, and reputation sources.
2. Add audit logging and stronger multi-user permission checks.
3. Add a visual workflow builder for editing triggers/actions from the UI.
4. Expand into campaigns, memberships, mobile workflows, and advanced reporting.
