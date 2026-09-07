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
| Framework | Next.js 16, App Router, TypeScript |
| Styling | Tailwind CSS v4 — tokens live in `src/app/globals.css` via `@theme` |
| Animation | GSAP + Lenis (see `src/lib/gsap.ts`, `src/lib/lenis.ts`) |
| Auth | BetterAuth (`src/lib/auth.ts`) — admin only |
| ORM | Drizzle ORM (`src/db/schema.ts`, `src/db/index.ts`) |
| Database | PostgreSQL — **local Docker in dev** (host port 5437), **Neon serverless** in production |
| Email | Resend — installed, wire up when real client provides a domain |
| Images | Uploadthing — for admin gallery uploads |
| Fonts | Cormorant (display) + Jost (body) + DM Mono (mono) |
| Deploy | **Vercel** — auto-deploys from `main` branch |

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
- **BetterAuth migrations** — auth tables (`user`, `session`, `account`, `verification`) are in `src/db/auth-schema.ts` and included in `drizzle.config.ts`. Run `npx drizzle-kit generate && npx drizzle-kit migrate` to apply. Do NOT use `@better-auth/cli migrate` — it does not work with Drizzle.
- **One `DATABASE_URL`, and it is local** — `drizzle.config.ts` loads `.env.local` via `@next/env`,
  and dotenv keeps the LAST value for a repeated key. `.env.local` carried both a local and a
  Neon `DATABASE_URL` from May 2026 until 2026-09-07, so every "local" run wrote to production.
  Never put a Neon URL in `.env.local`; Vercel supplies it to the deployed app.
  Always run migrations with `npx drizzle-kit migrate` (no prefix needed).
- **No comments** unless the WHY is genuinely non-obvious.

## Running Locally

```bash
npm run dev          # start dev server
npx tsc --noEmit     # type check
```

## Database

Development runs Postgres locally in Docker. Two containers can provide it and
both publish **host port 5437**; only one may run at a time.

```bash
docker start mountain-nest-db     # the long-standing standalone container
# or
docker compose up -d db           # the compose service, same port

npx drizzle-kit generate          # generate migration from schema changes
npx drizzle-kit migrate           # apply migrations to DB
```

`.env.local` must contain **exactly one** `DATABASE_URL` and it must be the
local one — see the note in `.env.example`. Production is Neon and is
configured only through the Vercel dashboard.

## Deploy (Vercel)

- Auto-deploys on every push to `main`
- Env vars set in Vercel dashboard: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `NEXT_PUBLIC_APP_URL`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `ADMIN_EMAIL`, `UPLOADTHING_SECRET`, `UPLOADTHING_APP_ID`
- `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` must match the live Vercel domain

## Next Session — Performance Sprint

Goals for next session:
- Audit and improve Core Web Vitals (LCP, CLS, INP) on Vercel deployment
- Optimize hero image loading (priority, sizing, format)
- Lazy-load below-the-fold images and sections
- Review bundle size — check for unused dependencies
- Add `next/image` blur placeholders for room images
- Audit GSAP animations for layout thrash (use `will-change` sparingly)
- Check font loading strategy (preload, display swap)
- Run Lighthouse on the deployed URL and fix top issues
