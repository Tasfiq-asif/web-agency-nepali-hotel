# Mountain Nest Hotel — Build Context

Generated: 2026-05-16 | Last updated: 2026-05-19 (Sprint 11 — Admin API round-trip)

---

## Brief

- **Hotel name:** Mountain Nest Hotel
- **Industry:** Boutique Mountain Hotel (Nepali mountain lodge)
- **Type:** Client site (real conversion site, not a marketplace template)
- **Slug:** `web-agency-nepali-hotel`
- **Local path:** `/Users/tasfiqsunny/Documents/code/WebDev/2026/web-dev-agency/web-agency-nepali-hotel`
- **Primary CTA:** Direct booking inquiry — visitor submits dates + room preference without going through an OTA
- **Reference sites:** jagerhof.net (hero treatment, minimal nav), dwarikas.com (Nepali luxury reference)

---

## Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 15 (App Router) | Same as Starlyn |
| Styling | Tailwind CSS v4 | Same as Starlyn |
| Animation | GSAP + Lenis | Same as Starlyn — import patterns from Starlyn lib/ |
| Auth | **BetterAuth** | Admin dashboard only — single admin user |
| ORM | **Drizzle ORM** | BetterAuth official recommendation |
| Database | **PostgreSQL** | Neon serverless — `@neondatabase/serverless` + `drizzle-orm/neon-http` |
| Email | **Resend** | Booking inquiry confirmations + admin notifications |
| Image upload | **Uploadthing** | Admin gallery + room photo uploads |
| SEO | **next-sitemap** | Auto sitemap generation |
| Fonts | **Cormorant** + **Jost** + **DM Mono** | All Google Fonts — load via next/font |

---

## Pages

- [ ] `/` — Home
- [ ] `/rooms` — Rooms & Suites (listing page)
- [ ] `/rooms/[slug]` — Individual Room detail
- [ ] `/dining` — Dining & Local Cuisine
- [ ] `/activities` — Activities & Nature
- [ ] `/gallery` — Visual gallery with lightbox
- [ ] `/about` — About / Our Story
- [ ] `/contact` — Contact + inquiry form
- [ ] `/book` — Booking flow (multi-step: dates → room → details → confirm)
- [ ] `/admin` — Admin dashboard (protected)
- [ ] `/admin/bookings` — Booking manager
- [ ] `/admin/calendar` — Availability + pricing manager
- [ ] `/admin/rooms` — Room content editor
- [ ] `/admin/gallery` — Gallery manager
- [ ] `/admin/content` — Homepage/page content editor
- [ ] `/admin/seo` — SEO meta fields per page

---

## Buyer Psychology

- **Primary desire:** Full occupancy with direct bookings during peak trekking seasons (March–May, Oct–Nov)
- **Core fear:** Paying 20% OTA commission forever because guests don't trust the site enough to book direct
- **Vocabulary:** "guests", "stay", "reserve", "lodge", "suites", "Himalayan views", "trekking season"
- **Avoid:** "cheap", "budget", "hostel-style", "book" (use "reserve")

---

## Design Tokens

```css
/* Colors */
--canvas:         #F5F0E8;   /* warm ivory */
--ink:            #1C2B1A;   /* deep forest near-black */
--accent:         #C4704F;   /* terracotta */
--surface-dark:   #2D4A2A;   /* deep forest green */
--warm-mid:       #8B7355;   /* warm brown */
--hairline:       #DDD8CE;   /* warm divider */
--text-secondary: #6B6558;   /* supporting text */

/* Typography */
--font-display: 'Cormorant', Georgia, serif;
--font-body:    'Jost', system-ui, sans-serif;
--font-mono:    'DM Mono', monospace;

/* Animation preset: luxury */
--ease-reveal:      cubic-bezier(0.22, 1, 0.36, 1);
--ease-transition:  cubic-bezier(0.76, 0, 0.24, 1);
--ease-nav:         cubic-bezier(0.16, 1, 0.3, 1);
```

**Section rhythm:** Ivory → Dark forest → Ivory → Dark forest → Ivory → Terracotta CTA → Dark footer

---

## Component Plan

Ordered by phase. ✅ = copy from Starlyn. 🔨 = build new.

### Phase 1 — Foundation
- ✅ SmoothScroll (`starlyn/src/components/animations/SmoothScroll.tsx`)
- ✅ Preloader (`starlyn/src/components/animations/Preloader.tsx`)
- ✅ MotionProvider (`starlyn/src/components/animations/MotionProvider.tsx`)
- ✅ PageTransitionCurtain (`starlyn/src/components/animations/`)
- ✅ lib/gsap.ts, lib/lenis.ts, lib/preloader.ts (copy from Starlyn)
- 🔨 globals.css — mountain hotel tokens (new palette, Fraunces + Plus Jakarta Sans)
- 🔨 tailwind.config.ts — extend with custom tokens
- 🔨 SiteShell — layout.tsx wiring, font loading, providers

### Phase 2 — Navigation + Footer
- ✅ FlipLink (`starlyn/src/components/ui/FlipLink.tsx`)
- ✅ SectionLabel (`starlyn/src/components/ui/SectionLabel.tsx`)
- ✅ MagneticButton (`starlyn/src/components/ui/MagneticButton.tsx`)
- 🔨 Navbar — minimal 4-item nav (Home / Rooms / Activities / Reserve) + sticky CTA
- 🔨 FooterMinimal — contact, socials, WhatsApp, policies, Nepal Tourism Board number

### Phase 3 — Hero & Shell
- 🔨 HeroFullscreen — full-bleed landscape, headline, sticky "Reserve Your Stay" CTA
- 🔨 IntroStatement — centered centered text block, ivory bg, 2–3 sentences on the lodge
- 🔨 StatStrip — dark forest bg: elevation, rooms, years open, trekking routes
- 🔨 CTASection — terracotta accent, "Reserve Your Stay", links to /book

### Phase 4 — Core Sections (Homepage)
- ✅ FeatureSplit (adapt from Starlyn — dining feature section)
- ✅ TestimonialCarousel (adapt from Starlyn)
- 🔨 RoomCardGrid — 2-col grid of RoomCard components
- 🔨 RoomCard — photo, name, amenities, price/night, Reserve CTA
- 🔨 ActivityGrid — 3-col icon + title + description
- 🔨 GalleryMasonry — masonry layout with lightbox

### Phase 5 — Rooms Page
- 🔨 RoomsListing — grid of all rooms with filter by guest count
- 🔨 RoomDetail — full room page: photo gallery, amenities list, pricing, BookingForm embed

### Phase 6 — Booking System
- 🔨 AvailabilityCalendar — date range picker, blocked dates from DB
- 🔨 BookingForm — multi-step: dates → room → guests → contact details → confirm
- 🔨 BookingConfirmation — success state + "we'll confirm within 4 hours" message
- 🔨 BookingEmailTemplate — Resend email template for guest confirmation
- 🔨 AdminNotificationEmail — Resend email template for admin new booking alert

### Phase 7 — Admin Dashboard
- 🔨 AdminShell — protected layout, sidebar nav, BetterAuth session gate
- 🔨 AdminDashboardHome — occupancy overview, bookings today/week, quick stats
- 🔨 AdminBookingTable — all bookings, filter by status/date/room, confirm/cancel
- 🔨 AdminCalendarManager — block dates, seasonal pricing, minimum stay rules
- 🔨 AdminRoomEditor — edit room name, description, amenities, max guests, base price
- 🔨 AdminGalleryUploader — Uploadthing drag-and-drop, image reorder, delete
- 🔨 AdminContentEditor — edit homepage intro, about story, activities, dining text
- 🔨 AdminSEOFields — meta title, description, OG image per page

### Phase 8 — Remaining Pages
- 🔨 Dining page — FeatureSplit hero + menu sections + local ingredients story
- 🔨 Activities page — ActivityGrid full page + seasonal highlights
- 🔨 Gallery page — full GalleryMasonry with category filters
- 🔨 About page — story, team, philosophy, sustainability
- 🔨 Contact page — contact info, WhatsApp CTA, map embed, inquiry form

### Phase 9 — Animations & Mobile
- Apply luxury-preset across all sections
- Hero parallax: `yPercent: -15, scrub: 1.8`
- Room card hover: `scale(1.03)`, 0.6s ease
- Mobile optimization audit

### Phase 10 — SEO & QA
- Schema markup: `LodgingBusiness`, `Hotel`, `Room`, `Review`, `BreadcrumbList`
- next-sitemap configuration
- robots.txt (block /admin)
- Core Web Vitals audit (LCP < 2.5s)
- Accessibility audit
- Final visual QA

---

## Database Schema (Drizzle)

```
bookings          — id, roomId, guestName, email, phone, nationality, checkIn, checkOut, adults, children, specialRequests, status (pending/confirmed/cancelled), createdAt
rooms             — id, slug, name, description, maxGuests, basePrice, amenities (json), images (json), isActive
blocked_dates     — id, roomId, date, reason
seasonal_pricing  — id, roomId, startDate, endDate, pricePerNight
gallery_images    — id, url, alt, category, order, createdAt
pages_content     — id, pageKey, field, value, updatedAt
pages_seo         — id, pageKey, metaTitle, metaDescription, ogImage, updatedAt
users             — managed by BetterAuth (admin only)
sessions          — managed by BetterAuth
```

---

## Integrations

- **BetterAuth** — admin auth (single admin user, email+password)
- **Drizzle ORM** — DB queries, migrations
- **PostgreSQL** — Neon serverless (neon.tech project, user provides DATABASE_URL)
- **Resend** — booking confirmation emails + admin alerts
- **Uploadthing** — admin image uploads
- **next-sitemap** — automated sitemap

---

## Phase & Sprint Status

### Phase 0: Discovery & Spec ✅
### Phase 1: Foundation ✅
  - Sprint 1.1: Repo init + design tokens (globals.css) ✅
  - Sprint 1.2: SiteShell + providers + lib/ (copy from Starlyn) ✅
  - Sprint 1.3: Database schema + Drizzle setup + BetterAuth ✅
### Phase 2: Navigation + Footer ⏳
  - Sprint 2.1: Navbar ✅
  - Sprint 2.2: FooterMinimal ✅
### Phase 3: Hero & Shell ⏳
  - Sprint 3.1: HeroFullscreen ✅
  - Sprint 3.2: IntroStatement + StatStrip + CTASection ✅
### Phase 4: Core Homepage Sections ✅
  - Sprint 4.1: RoomCardGrid + RoomCard ✅
  - Sprint 4.2: FeatureSplit (dining) + ActivityGrid ✅
  - Sprint 4.3: TestimonialCarousel + GalleryMasonry ✅
### Phase 5: Rooms Pages ✅
  - Sprint 5.1: Rooms listing page ✅
  - Sprint 5.2: Room detail page ✅
### Phase 6: Booking System ⏳
  - Sprint 6.1: AvailabilityCalendar component ✅
  - Sprint 6.2: BookingForm multi-step ✅
  - Sprint 6.2b: Desktop booking layout redesign (split panel) ✅
  - Sprint 6.3: Booking API routes + email triggers ✅
### Phase 7: Admin Dashboard ⏳
  - Sprint 7.1: AdminShell + auth gate + dashboard home ✅
  - Sprint 7.2: AdminBookingTable + booking actions ✅
  - Sprint 7.3: AdminCalendarManager ✅
  - Sprint 7.4: AdminRoomEditor + AdminGalleryUploader ✅
  - Sprint 7.5: AdminContentEditor + AdminSEOFields ✅
### Phase 8: Remaining Pages ⏳
  - Sprint 8.1: Dining + Activities pages ✅
  - Sprint 8.2: Gallery + About + Contact pages ✅
### Phase 9: Animations & Mobile ⏳
  - Sprint 9.1: Animation preset applied across all sections ✅
  - Sprint 9.2: Mobile optimization ✅
### Phase 10: SEO & QA ⏳
  - Sprint 10.1: Schema markup + sitemap + robots ✅
  - Sprint 10.2: Core Web Vitals + a11y + visual QA ✅
### Phase 11: Admin API Round-Trip ✅
  - Sprint 11: Rooms/SEO/content DB→guest wiring + seed mechanism ✅

---

## Decisions Log

- **2026-05-16** — Auth: BetterAuth chosen over NextAuth. Pairs natively with Drizzle, simpler session management for single-admin use case.
- **2026-05-16** — Payment: No Stripe for now. Booking model is inquiry-to-confirm. Admin confirms manually, sends payment details separately.
- **2026-05-16** — Database: Self-hosted PostgreSQL on user's VPS. DB_URL provided via .env. Drizzle handles migrations.
- **2026-05-22** — Database migrated to Neon serverless PostgreSQL. `src/db/index.ts` now uses `@neondatabase/serverless` `neon()` + `drizzle-orm/neon-http` instead of `pg` Pool. No schema changes — just the driver swap. Drizzle migrations still run against `DATABASE_URL` via drizzle-kit.
- **2026-05-16** — Fonts revised: Cormorant (display) + Jost (body) + DM Mono (labels). Replaced Fraunces (too quirky/wonky) and Plus Jakarta Sans (too startup-adjacent). Cormorant is old-style serif with artisanal, old-world warmth — italics available, weights 300–600. Jost is geometric humanist, clean and premium.
- **2026-05-16** — Font replaced again: Gloock → Cormorant. Gloock is single-weight with no italic support. Cormorant offers weights 300–600, normal + italic, same old-world warmth with far more flexibility.
- **2026-05-16** — Heading font-weight: 400 default; can use 300 or 500 with Cormorant (multi-weight).
- **2026-05-16** — Nav: Max 4 items enforced — Home / Rooms / Activities / Reserve. WhatsApp link in header.
- **2026-05-17** — next.config.ts: Added `dangerouslyAllowSVG` for placeholder room images. Remove this when real JPGs are added.
- **2026-05-17** — Room detail page split into server component (page.tsx) + client component (RoomDetailClient.tsx). Server side handles generateStaticParams, generateMetadata, and notFound(). Client side handles GSAP. This pattern should be used for all future detail pages.
- **2026-05-17** — RoomCardGrid placed between StatStrip and CTASection. Section rhythm: dark → ivory (rooms) → terracotta. Moved CTASection to follow rooms for natural "see rooms → reserve" flow.
- **2026-05-17** — AvailabilityCalendar built from scratch (not using react-day-picker). Full control over Cormorant italic month header, DM Mono day numbers, square cell geometry, half-gradient range bars at endpoints. API route at /api/availability returns blocked_dates + confirmed booking dates for a given roomSlug + date window. DB-not-connected error is caught and returns empty array so calendar renders in dev without a live DB.
- **2026-05-17** — /book page created as a test harness for the calendar. Will become the full multi-step booking flow in Sprint 6.2.
- **2026-05-17** — BookingForm built as a single client component with `useMobile()` hook (breakpoint 768px). Desktop: 4-step track stepper + horizontal room cards (120px image) + side-by-side nav. Mobile: segmented progress bar + "02 · ROOM / 2 of 4" label + vertical portrait room cards (3:2 ratio) with availability badge overlaid on image + full-width Continue CTA + larger 48px touch targets. Room availability fetched in parallel (6 concurrent API calls) on Step 2 mount. /api/bookings POST is gracefully handled (Sprint 6.3 builds the route).
- **2026-05-17** — Awwwards quality pass: 9 targeted fixes applied. Hero headline `clamp(5rem, 13vw, 14rem)`. IntroStatement overlaps hero -100px with border-radius 24px. StatStrip is now full-bleed (no container cap). Gradient bridges on all section transitions via backgroundImage (no z-index conflicts). ActivityGrid emojis replaced with Cormorant italic numerals 01–06. GalleryMasonry grid bleeds past container. RoomCard hover orchestrates 3 properties via CSS (card, h3, price-row). CTA buttons use btn-wipe fill-wipe CSS class — JS color handlers removed. ScrollVelocityEffect applies skewY to .container divs (not section backgrounds) during fast scroll.
- **2026-05-18** — Sprint 6.3: Email is fire-and-forget (Promise.allSettled) — a Resend failure never blocks the booking save. If RESEND_API_KEY is unset, sendBookingEmails() returns immediately. Conflict check uses `confirmed` status only, matching the availability calendar policy. Total price calculated from DB basePriceUsd (not client-side ROOMS data) for integrity.
- **2026-05-18** — Desktop booking layout redesign (Sprint 6.2b): Full-viewport 52/48 split panel at ≥1024px. Left panel: pinned step indicator (hairline-bordered header), scrollable step content, pinned nav footer. Right panel (dark ink bg): 55% image area cycles through 4 gallery webps via CSS opacity crossfade → blurs with "Choose a room →" overlay when on step 2+ with no room → switches to selected room's static image with gradient scrim + name/tagline. Bottom 45%: "Select dates to begin →" hint until dates chosen, then progressive summary rows (check-in, check-out, nights, guests, room) + terracotta estimated total when room+nights are set. useMobile() breakpoint raised from 768→1024 to match split activation. book/page.tsx simplified to bare `<main>` — BookingForm owns all layout internally. Mobile layout (segmented bar, single-column, NavRow inline) unchanged.
- **2026-05-18** — Sprint 7.1: Route groups introduced to isolate guest and admin layouts. src/app/layout.tsx is now minimal (fonts + globals.css only). Guest pages moved to src/app/(guest)/ with their own layout (Navbar, Footer, etc.). Admin area uses src/app/admin/login/ (public) + src/app/admin/(protected)/ (auth-gated via BetterAuth auth.api.getSession). Admin aesthetic: dark utility interface — #1C2B1A sidebar, #243620 main bg, no GSAP. Dashboard shows 3 stat cards + last-10 bookings table. DB failures caught gracefully so dashboard renders in dev without a live DB.
- **2026-05-19** — Sprint 9.1: Section headers (RoomCardGrid, ActivityGrid, GalleryMasonry) now have scroll-triggered line-mask + stagger reveals — label fades at top:80%, heading lines yPercent 110→0 at top:75% power4.out. RoomCard hover replaced: CSS scale(1.05) removed, GSAP mouseenter scale(1.03) 0.6s power3.out + mouseleave scale(1) 1.1s elastic.out(1,0.35) — elastic snap-back is the luxury signal. FeatureSplit image: height 120%, yPercent 5→-5 scrub:1.5 (image lags behind scroll, creates depth). TestimonialCarousel: CSS opacity transition removed, GSAP fromTo on [active] change (opacity 0,y:18 → 1,0). All y values normalized to 40 for content reveals.
- **2026-05-19** — Sprint 9.2: Mobile audit at 375px. Hero headline clamp min reduced 5rem→3.25rem (was overflowing at 80px). Hero CTA + burger + WhatsApp all raised to ≥44px tap targets. GalleryMasonry bento grid moved from inline styles to `.gallery-bento` CSS class — 2-col auto-flow on mobile, 4-col bento at ≥768px (inline area-map styles overridden with !important on mobile). Testimonial dots refactored: visual span separated from button, padding:18px 12px for 44px touch area. Room card hover wrapped in `@media (hover: hover)` — no accidental translateY on tap. Mobile nav div `md:hidden` inline display:flex conflict fixed — moved to Tailwind `flex` class.
- **2026-05-19** — Sprint 10.2 a11y: skip-to-content uses `transform: translateY(calc(-100% - 2rem))` hide + `:focus-visible` slide-in. Using `top: -100%` on `position: fixed` is unreliable in Chromium headless — transform is always correct.
- **2026-05-19** — Sprint 10.2 metadata: dining/activities/about pages are `'use client'` components so metadata can't be co-located. Used route-level `layout.tsx` files (server components) that export metadata and render `<>{children}</>` — no visual impact, metadata applies correctly.
- **2026-05-19** — Sprint 10.2 AvailabilityCalendar: added `containerType: 'inline-size'` on root wrapper to enable `cqw` units. Day number font changed from `1.1vw` (viewport-relative, ignores container) to `2.2cqw` (container-relative). Root + grid wrapper get `width: 100%; min-width: 0` to prevent flex overflow.
- **2026-05-19** — Sprint 11: Admin→DB→guest round-trip. `src/lib/roomUtils.ts` `mergeRoom()` normalizes DB rows to `Room` display type (tags from static fallback if not in DB, images from DB `images[]` else static path). `src/app/api/rooms/route.ts` public endpoint returns active rooms from DB, falls back to static ROOMS if DB empty or offline. `src/app/api/admin/seed/route.ts` admin-only POST seeds 6 default rooms from static data via `onConflictDoNothing()`. `SeedRoomsButton.tsx` shown in admin/rooms when table is empty. `RoomCardGrid` and `RoomsClient` now accept `rooms` prop (home page and /rooms page fetch from DB server-side). `BookingForm` initializes rooms state from static ROOMS, fetches `/api/rooms` on mount to update with DB prices/names. `src/lib/getSeo.ts` helper queries `pages_seo` with hardcoded fallbacks — all guest pages now use `generateMetadata()` that reads from DB.
- **2026-05-18** — Sprint 7.4: Uploadthing FileRouter uses `req.headers` (passed from middleware param) to auth-gate via BetterAuth — not `next/headers()`. RoomEditorForm is an accordion — clicking "Edit" on a room expands an inline form; saves via PATCH /api/admin/rooms/[id]. GalleryManager uses generateUploadDropzone from @uploadthing/react; after Uploadthing upload completes, client POSTs to /api/admin/gallery to save URL+alt+category to DB. Alt/category edits save on blur. Reorder uses sortOrder swap via two concurrent PATCHes. @uploadthing/react/styles.css imported in root layout (required for UT UI).

---

## Files Created

- `src/components/layout/Footer.tsx` — footer: brand/tagline, contact columns, WhatsApp CTA, quick links, reserve CTA, socials, NTB reg field, policies, copyright
- `src/components/ui/FlipLink.tsx` — flip-ticker nav link (adapted from Starlyn, hotel token defaults)
- `src/components/layout/Navbar.tsx` — fixed navbar: transparent→canvas on scroll, FlipLinks, WhatsApp icon, Reserve CTA, full-screen mobile menu
- `src/app/globals.css` — full mountain hotel design tokens (Tailwind v4 @theme)
- `src/app/layout.tsx` — Fraunces + Plus Jakarta Sans + DM Mono, providers wired
- `src/app/api/auth/[...all]/route.ts` — BetterAuth catch-all handler
- `src/components/animations/SmoothScroll.tsx` — copied from Starlyn
- `src/components/animations/MotionProvider.tsx` — copied from Starlyn
- `src/components/animations/Preloader.tsx` — copied from Starlyn (uses --dark compat alias)
- `src/components/animations/PageTransitionCurtain.tsx` — copied from Starlyn
- `src/components/animations/PageWrapper.tsx` — copied from Starlyn
- `src/lib/gsap.ts` — GSAP + ScrollTrigger setup
- `src/lib/lenis.ts` — Lenis smooth scroll init/destroy
- `src/lib/preloader.ts` — preloader state utility
- `src/lib/textReveal.ts` — text animation utilities
- `src/lib/auth.ts` — BetterAuth server config (Drizzle adapter)
- `src/lib/auth-client.ts` — BetterAuth client hooks
- `src/db/schema.ts` — full Drizzle schema (rooms, bookings, blocked_dates, seasonal_pricing, gallery, content, seo)
- `src/db/index.ts` — Drizzle DB instance (pg pool)
- `drizzle.config.ts` — Drizzle Kit config
- `.env.example` — all required env vars documented
- `src/components/sections/HeroFullscreen.tsx` — full-bleed hero: landscape image with parallax, Cormorant headline with line-mask reveal, subtitle, Reserve CTA, scroll indicator
- `src/components/sections/IntroStatement.tsx` — ivory centered text block: Cormorant heading, terracotta italic accent, body paragraph, scroll-triggered reveal
- `src/components/sections/StatStrip.tsx` — dark forest bg: 4 stats (elevation, rooms, years, routes), vertical dividers, scroll-triggered fade-in
- `src/components/sections/CTASection.tsx` — terracotta bg: centered heading, subtitle, ivory Reserve CTA button, scroll-triggered reveal
- `src/components/ui/RoomCard.tsx` — room card: image with hover zoom, name, tagline, amenity tags, price/night, guest count, Reserve CTA link
- `src/components/sections/RoomCardGrid.tsx` — 2-col grid of 4 rooms with section header, stagger animation, "View All Rooms" link
- `public/images/rooms/placeholder-1.svg` through `placeholder-4.svg` — placeholder room images
- `src/components/sections/FeatureSplit.tsx` — dining feature: image + text split, scroll reveal, link to /dining
- `src/components/sections/ActivityGrid.tsx` — 6 activities in 3-col grid, dark forest bg, emoji icons, stagger animation
- `public/images/dining-placeholder.svg` — placeholder dining image
- `src/components/sections/TestimonialCarousel.tsx` — auto-rotating guest testimonials, dot nav, ivory bg, GSAP scroll reveal
- `src/components/sections/GalleryMasonry.tsx` — 6-image masonry grid, dark forest bg, hover scale, stagger reveal
- `public/images/gallery/placeholder-1.svg` through `placeholder-6.svg` — gallery placeholder images
- `src/data/rooms.ts` — updated Room interface + ROOMS data with `description` field and expanded amenities (6 per room)
- `src/app/rooms/page.tsx` — rooms listing page: dark forest header, guest-count filter bar, full 6-room grid, GSAP reveals
- `src/app/rooms/[slug]/page.tsx` — server component: generateStaticParams, generateMetadata, notFound() for invalid slugs
- `src/app/rooms/[slug]/RoomDetailClient.tsx` — client component: 80vh hero image with gradient + text overlay, meta row (price + guests), description, amenity chips, dark forest sticky booking widget, Reserve CTA → /book?room=[slug]
- `src/components/animations/ScrollVelocityEffect.tsx` — RAF-based scroll velocity skew, targets main .container divs, max ±1.2°, lerp 0.07
- `src/app/api/availability/route.ts` — GET endpoint: blocked_dates + confirmed booking dates for roomSlug + date range
- `src/components/ui/AvailabilityCalendar.tsx` — custom date range picker: DM Mono numbers, Cormorant italic header, half-gradient range bars, today dot, clear dates, nights summary
- `src/app/book/page.tsx` — server component: reads ?room= searchParam, passes to BookingForm
- `src/components/sections/BookingForm.tsx` — 4-step booking form (Dates → Room → Details → Confirm), responsive desktop/mobile layouts, parallel availability fetch, graceful submit error handling
- `src/app/book/page.tsx` — simplified to bare `<main>` — BookingForm owns all layout, desktop split panel + mobile single-column internally
- `src/lib/email-templates.ts` — HTML email templates: guestConfirmationEmail + adminNotificationEmail (inline-styled, hotel aesthetic)
- `src/lib/email.ts` — Resend client + sendBookingEmails() (Promise.allSettled — email never blocks booking save)
- `src/app/api/bookings/route.ts` — POST: validate → find room → conflict check → insert → fire emails → return { id }
- `src/app/api/bookings/[id]/route.ts` — GET: returns booking + room fields for confirmation page
- `src/app/layout.tsx` — minimal root: HTML, fonts, globals.css only (guest nav/footer moved to (guest) group)
- `src/app/(guest)/layout.tsx` — guest layout: Preloader, ScrollVelocityEffect, Navbar, SmoothScroll, MotionProvider, Footer
- `src/app/(guest)/page.tsx` — home (moved from src/app/page.tsx)
- `src/app/(guest)/rooms/` — rooms pages (moved from src/app/rooms/)
- `src/app/(guest)/book/` — booking form (moved from src/app/book/)
- `src/app/admin/login/page.tsx` — server: checks session (redirect if already logged in), renders LoginForm
- `src/app/admin/login/LoginForm.tsx` — client: email+password form, signIn.email(), router.push('/admin') on success
- `src/app/admin/(protected)/layout.tsx` — auth gate: auth.api.getSession(), redirect to /admin/login if null; renders AdminSidebar + main
- `src/app/admin/(protected)/page.tsx` — dashboard home: 3 stat cards (pending/confirmed-this-month/total) + last 10 bookings table with status pills
- `src/components/admin/AdminSidebar.tsx` — client: fixed 240px sidebar, nav links, sign out button, active state via usePathname
- `src/app/api/admin/bookings/[id]/route.ts` — PATCH: admin-auth-gated confirm/cancel action, updates booking status
- `src/components/admin/BookingRow.tsx` — client: single table row with optimistic status update + router.refresh(), exports BOOKING_ROW_GRID constant
- `src/app/admin/(protected)/bookings/page.tsx` — server: full reservations table with All/Pending/Confirmed/Cancelled filter tabs (with counts), 25-per-page pagination, BookingRow client components
- `src/app/api/admin/blocked-dates/route.ts` — POST: auth-gated insert of multiple blocked_dates rows; validates YYYY-MM-DD format; roomId null = property-wide
- `src/app/api/admin/blocked-dates/[id]/route.ts` — DELETE: auth-gated remove one blocked date by id
- `src/app/api/admin/seasonal-pricing/route.ts` — POST: auth-gated insert seasonal pricing rule; returns row joined with room name
- `src/app/api/admin/seasonal-pricing/[id]/route.ts` — DELETE: auth-gated remove one pricing rule by id
- `src/app/admin/(protected)/calendar/page.tsx` — server: fetches rooms + blocked_dates + seasonal_pricing, passes to CalendarManager; DB offline caught gracefully
- `src/components/admin/CalendarManager.tsx` — client: two-tab UI — "Blocked Dates" (custom month calendar grid, multi-select, room scope, reason, delete list) + "Seasonal Pricing" (add form, table with delete); optimistic updates + router.refresh()
- `src/lib/uploadthing.ts` — Uploadthing FileRouter: galleryImage endpoint (4MB, 10 files), BetterAuth session check via req.headers in middleware
- `src/app/api/uploadthing/route.ts` — Uploadthing GET/POST route handler
- `src/app/api/admin/rooms/route.ts` — GET: list all rooms (admin-gated)
- `src/app/api/admin/rooms/[id]/route.ts` — PATCH: update room fields (name, description, maxGuests, basePriceUsd, amenities, isActive)
- `src/app/api/admin/gallery/route.ts` — GET: list gallery images; POST: save new uploaded image to DB
- `src/app/api/admin/gallery/[id]/route.ts` — PATCH: update alt/category/sortOrder; DELETE: remove image
- `src/app/admin/(protected)/rooms/page.tsx` — server: fetches all rooms, passes to RoomEditorForm
- `src/app/admin/(protected)/gallery/page.tsx` — server: fetches gallery images ordered by sortOrder, passes to GalleryManager
- `src/components/admin/RoomEditorForm.tsx` — client: accordion list of rooms, each expands to inline editor with all fields + isActive toggle
- `src/components/admin/GalleryManager.tsx` — client: Uploadthing dropzone + image grid (alt/category editable on blur, up/down reorder, delete)
- `src/app/api/admin/content/route.ts` — GET: return all content rows grouped by pageKey; POST: upsert fields for a pageKey (select-then-update-or-insert per field)
- `src/app/api/admin/seo/route.ts` — GET: return all pages_seo rows (admin-gated)
- `src/app/api/admin/seo/[pageKey]/route.ts` — PATCH: upsert SEO row for pageKey (select-then-update-or-insert)
- `src/app/admin/(protected)/content/page.tsx` — server: fetches all pages_content, groups by pageKey, passes to ContentEditor; DB offline caught gracefully
- `src/app/admin/(protected)/seo/page.tsx` — server: fetches all pages_seo, builds SeoMap, passes to SeoEditor; DB offline caught gracefully
- `src/components/admin/ContentEditor.tsx` — client: left-rail page tabs (Home/About/Dining/Activities) + right panel of labeled fields per page; per-page "Save" via POST /api/admin/content
- `src/components/admin/SeoEditor.tsx` — client: left-rail page tabs (8 pages) with green dot for pages that have saved SEO + right panel with metaTitle (60-char counter), metaDescription (160-char counter), ogImage URL; per-page "Save" via PATCH /api/admin/seo/[pageKey]
- `src/app/(guest)/dining/page.tsx` — dining page: dark-forest header + kitchen story split (FeatureSplit-style, ivory) + three meal moments cards (dark forest) + local ingredients 2-col grid (ivory) + CTASection
- `src/app/(guest)/activities/page.tsx` — activities page: dark-forest header + full 6-activity grid with images + tags (ivory) + four-season highlights grid (dark forest) + CTASection
- `src/app/(guest)/gallery/page.tsx` — server component: DB fetch with static fallback; dark forest header + CTASection; passes images to GalleryClient
- `src/app/(guest)/gallery/GalleryClient.tsx` — client: category filter pills (All/Rooms/Dining/Activities/Views), CSS columns masonry grid, GSAP stagger reveal per filter change, lightbox with keyboard nav (Escape/arrows), body scroll lock, image counter in DM Mono
- `src/app/(guest)/about/page.tsx` — client: 5-section about page (page header → origin story → philosophy → sustainability → team) + CTASection; GSAP scroll reveals per section; all copy matches hotel voice
- `src/app/(guest)/contact/page.tsx` — server component: page header + contact info rows + WhatsApp CTA block + ContactForm + Find Us section with 4 route options
- `src/app/(guest)/contact/ContactForm.tsx` — client: name/email/message form, POSTs to /api/contact, success/error states
- `src/app/(guest)/contact/ContactReveal.tsx` — client: GSAP header line-reveal + scroll triggers; wraps entire page
- `src/app/api/contact/route.ts` — POST: validates name/email/message, logs to console, fires Resend email (fire-and-forget), returns { success: true }
- `src/components/seo/JsonLd.tsx` — server component: safe JSON-LD script injector (Unicode-escapes <, >, & to prevent script injection)
- `src/lib/schema.ts` — schema factory: hotelSchema() (LodgingBusiness+Hotel), roomSchema() (Accommodation), roomsListSchema() (ItemList)
- `next-sitemap.config.js` — next-sitemap config: excludes /admin + /api, generates robots.txt, uses NEXT_PUBLIC_APP_URL
- `src/app/(guest)/dining/layout.tsx` — route-level metadata: title "Dining & Cuisine", description
- `src/app/(guest)/activities/layout.tsx` — route-level metadata: title "Activities & Nature", description
- `src/app/(guest)/about/layout.tsx` — route-level metadata: title "Our Story", description
- `src/lib/roomUtils.ts` — `mergeRoom()` normalizes DB room rows to `Room` display type; uses static data fallback for tagline/imageSrc
- `src/lib/getSeo.ts` — `getPageSeo(pageKey, fallback)` queries `pages_seo` table, returns Metadata with DB values overriding hardcoded fallbacks
- `src/app/api/rooms/route.ts` — public GET: active rooms from DB merged via `mergeRoom()`, static ROOMS fallback if DB empty/offline
- `src/app/api/admin/seed/route.ts` — admin-only POST: inserts 6 default rooms from static ROOMS data; `onConflictDoNothing()` on slug
- `src/components/admin/SeedRoomsButton.tsx` — client: calls POST /api/admin/seed, shown in admin rooms page when table is empty

---

## Blocked Items

_(none yet)_

---

## Next Session

**Start at:** Production-ready ✅ — deploy when DB is live
**Context:** Sprint 11 wired the full admin→DB→guest loop. Rooms, SEO, and gallery all read from DB with static fallbacks. Admin can now seed rooms, edit them, and see changes on the guest site. All page metadata reads from `pages_seo` table with hardcoded fallbacks. BookingForm fetches live room list from `/api/rooms` on mount.
