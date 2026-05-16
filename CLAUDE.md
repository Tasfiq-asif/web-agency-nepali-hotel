@AGENTS.md

# Mountain Nest Hotel — Claude Session Guide

**Always read `PROJECT_CONTEXT.md` first before doing any work in this repo.**
It contains the current phase, sprint status, decisions log, and exactly where to start.

---

## Project

Boutique mountain hotel website for Mountain Nest Hotel (Nepal). Template to show potential clients — must be production-quality and deployable. Not a generic template; a real conversion site with booking system and admin dashboard.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15, App Router, TypeScript |
| Styling | Tailwind CSS v4 — tokens live in `src/app/globals.css` via `@theme` |
| Animation | GSAP + Lenis (see `src/lib/gsap.ts`, `src/lib/lenis.ts`) |
| Auth | BetterAuth (`src/lib/auth.ts`) — admin only |
| ORM | Drizzle ORM (`src/db/schema.ts`, `src/db/index.ts`) |
| Database | PostgreSQL — self-hosted VPS, connection via `DATABASE_URL` env var |
| Email | Resend — installed but not wired yet (add when real client + domain) |
| Images | Uploadthing — for admin gallery uploads |
| Fonts | Fraunces (display) + Plus Jakarta Sans (body) + DM Mono (mono) |
| Deploy | Docker — `Dockerfile` + `docker-compose.yml` (Postgres + Next.js) |

## Design Tokens

Colors: warm ivory `#F5F0E8`, deep forest `#1C2B1A`, terracotta `#C4704F`, forest green `#2D4A2A`
Animation preset: luxury — slow, deliberate, parallax depth. Never fast or snappy.
Section rhythm: Ivory → Dark forest → Ivory → Dark forest → Terracotta CTA → Dark footer.

## Key Conventions

- **No Stripe** — booking model is inquiry-to-confirm. Form saves to DB, admin confirms manually.
- **Max 4 nav items** — Home / Rooms / Activities / Reserve. Never add more.
- **WhatsApp** — visible in navbar and footer at all times.
- **Resend** — installed, do not remove. Wire it up when a real client provides a domain.
- **Starlyn patterns** — when building new components, check Starlyn first at `/Users/tasfiqsunny/Documents/code/WebDev/2026/agency-starlyn/starlyn-agency/src/`. Adapt rather than rewrite.
- **Tailwind v4** — no `tailwind.config.ts`. All tokens are in `globals.css` `@theme` block.
- **BetterAuth migrations** — BetterAuth manages its own auth tables. Run `npx @better-auth/cli migrate` separately from Drizzle migrations.
- **No comments** unless the WHY is genuinely non-obvious.

## Running Locally

```bash
npm run dev          # start dev server
npx tsc --noEmit     # type check
```

## Database

```bash
npx drizzle-kit generate   # generate migration from schema changes
npx drizzle-kit migrate    # apply migrations to DB
```

Requires `DATABASE_URL` in `.env.local`. See `.env.example` for format.

## Docker (VPS deploy)

```bash
docker compose up -d --build          # build and start all services
docker compose exec app npx drizzle-kit migrate   # run migrations (first deploy only)
docker compose logs -f app            # tail logs
```
