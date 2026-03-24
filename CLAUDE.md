# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

HappyCoach is a Slack bot + Next.js web dashboard for tracking fitness/activity challenges. Users log activities (km, hours) via Slack, accumulate points, and participate in group challenges. The web UI provides an admin dashboard and stats visualization.

## Commands

- `npm run dev` — Next.js dev server (localhost:3000)
- `npm run build` — production build
- `npm run start` — production server
- `npm run start:migrate` — run Prisma migrations then start server
- `npx next lint` — ESLint
- `npx prisma migrate dev` — apply database migrations in development
- `npx prisma generate` — regenerate Prisma client after schema changes

## Architecture

**Hybrid app**: Next.js 14 App Router (web UI) + @slack/bolt (Slack bot) in a single process.

### Layers

- **Server Actions** (`src/lib/actions/`) — entry points for all web mutations and queries (auth, events, users, bot, sessions, stats, themes). No REST API routes.
- **Services** (`src/lib/services/`) — business logic layer called by actions and Slack handlers.
- **Repositories** (`src/lib/repositories/`) — Prisma data access.
- **Handlers** (`src/lib/handlers/`) — Chain-of-responsibility pattern for Slack message processing: `BasicCommandsHandler` → `EventCommandHandler` → `NoEventCommandHandler`. Each handler matches regex patterns and passes unhandled messages to the next.
- **Models/Types** (`src/lib/models/`, `src/lib/types/`) — domain types and enums.

### Auth

Two auth paths:
1. **Slack**: Users auto-created when interacting with bot. Email verification via 5-digit code sent as Slack DM.
2. **Web login**: bcryptjs password hashing, cookie-based sessions stored in an in-memory cache with 1-hour rolling expiry (`src/lib/cache/cacheService.ts`). Middleware in `src/middleware.ts` refreshes cookies.

### Route Groups

- `src/app/(login)/` — public auth pages (login, register)
- `src/app/(main)/` — protected pages (dashboard, admin panel)
- Admin routes under `src/app/(main)/admin/` — events, users, logs, bot settings

### Database

PostgreSQL 15 via Prisma 5. Schema in `prisma/schema.prisma`. Key models: `User`, `record`, `event`, `event_records` (join table), `Theme`, `Setting`. Prisma client is a singleton (`src/lib/data/client.ts`).

### Deployment

Docker multi-stage build (Node 18). `docker-compose.yml` runs app + PostgreSQL with a persistent volume.

## Environment Variables

See `.env.example`. Required: `SLACK_BOT_TOKEN`, `SLACK_SIGNING_SECRET`, `APP_TOKEN`, `MAIN_CHANNEL`, `DATABASE_URL` (or individual `DB_*` vars).
