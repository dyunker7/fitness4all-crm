# Fitness4All CRM

A production-oriented CRM foundation for gym sales teams, tailored to Fitness4All and modeled on the parts of the GoHighLevel product surface that matter most here: CRM, pipelines, inbox, Meta integrations, booking, reminders, workflows, campaigns, reputation, reporting, and AI assist.

Payment processing is intentionally out of scope in this implementation.

The app is also configured as a PWA so it can be installed on phones and desktops after deployment over HTTPS.

## What is implemented

- A polished dashboard-style UI for:
  - CRM and pipeline visibility
  - unified inbox overview
  - calendar reminder strategies
  - workflow automation templates
  - launch channel coverage
  - modular platform architecture
  - phased roadmap visibility
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
- PWA support:
  - web app manifest
  - service worker
  - install prompt
  - app icons

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

1. Add authentication and persistent storage with PostgreSQL and Prisma.
2. Build role-aware pages for contacts, opportunities, inbox, calendars, and automation builder.
3. Wire real providers for Meta, Twilio, email, Google Calendar, and reputation sources.
4. Add workflow runtime persistence, audit logging, and background job processing with Redis.
5. Expand into campaigns, memberships, mobile workflows, and advanced reporting.
