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
| Database | PostgreSQL — **Neon serverless** (`@neondatabase/serverless` + `drizzle-orm/neon-http`) |
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
- **Neon DB** — `drizzle.config.ts` loads `.env.local` via `@next/env`. Always run migrations with `npx drizzle-kit migrate` (no prefix needed).
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
