# Mountain Nest Hotel — Build Context

Generated: 2026-05-16 | Last updated: 2026-05-16

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
| Database | **PostgreSQL** | Self-hosted on user's VPS |
| Email | **Resend** | Booking inquiry confirmations + admin notifications |
| Image upload | **Uploadthing** | Admin gallery + room photo uploads |
| SEO | **next-sitemap** | Auto sitemap generation |
| Fonts | **Fraunces** + **Plus Jakarta Sans** | Both Google Fonts — load via next/font |

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
--font-display: 'Fraunces', Georgia, serif;
--font-body:    'Plus Jakarta Sans', system-ui, sans-serif;
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
- **PostgreSQL** — self-hosted VPS (user provides DB_URL)
- **Resend** — booking confirmation emails + admin alerts
- **Uploadthing** — admin image uploads
- **next-sitemap** — automated sitemap

---

## Phase & Sprint Status

### Phase 0: Discovery & Spec ✅
### Phase 1: Foundation ⏳
  - Sprint 1.1: Repo init + design tokens (globals.css, tailwind.config.ts) ⏳
  - Sprint 1.2: SiteShell + providers + lib/ (copy from Starlyn) ⏳
  - Sprint 1.3: Database schema + Drizzle setup + BetterAuth ⏳
### Phase 2: Navigation + Footer ⏳
  - Sprint 2.1: Navbar ⏳
  - Sprint 2.2: FooterMinimal ⏳
### Phase 3: Hero & Shell ⏳
  - Sprint 3.1: HeroFullscreen ⏳
  - Sprint 3.2: IntroStatement + StatStrip + CTASection ⏳
### Phase 4: Core Homepage Sections ⏳
  - Sprint 4.1: RoomCardGrid + RoomCard ⏳
  - Sprint 4.2: FeatureSplit (dining) + ActivityGrid ⏳
  - Sprint 4.3: TestimonialCarousel + GalleryMasonry ⏳
### Phase 5: Rooms Pages ⏳
  - Sprint 5.1: Rooms listing page ⏳
  - Sprint 5.2: Room detail page ⏳
### Phase 6: Booking System ⏳
  - Sprint 6.1: AvailabilityCalendar component ⏳
  - Sprint 6.2: BookingForm multi-step ⏳
  - Sprint 6.3: Booking API routes + email triggers ⏳
### Phase 7: Admin Dashboard ⏳
  - Sprint 7.1: AdminShell + auth gate + dashboard home ⏳
  - Sprint 7.2: AdminBookingTable + booking actions ⏳
  - Sprint 7.3: AdminCalendarManager ⏳
  - Sprint 7.4: AdminRoomEditor + AdminGalleryUploader ⏳
  - Sprint 7.5: AdminContentEditor + AdminSEOFields ⏳
### Phase 8: Remaining Pages ⏳
  - Sprint 8.1: Dining + Activities pages ⏳
  - Sprint 8.2: Gallery + About + Contact pages ⏳
### Phase 9: Animations & Mobile ⏳
  - Sprint 9.1: Animation preset applied across all sections ⏳
  - Sprint 9.2: Mobile optimization ⏳
### Phase 10: SEO & QA ⏳
  - Sprint 10.1: Schema markup + sitemap + robots ⏳
  - Sprint 10.2: Core Web Vitals + a11y + visual QA ⏳

---

## Decisions Log

- **2026-05-16** — Auth: BetterAuth chosen over NextAuth. Pairs natively with Drizzle, simpler session management for single-admin use case.
- **2026-05-16** — Payment: No Stripe for now. Booking model is inquiry-to-confirm. Admin confirms manually, sends payment details separately.
- **2026-05-16** — Database: Self-hosted PostgreSQL on user's VPS. DB_URL provided via .env. Drizzle handles migrations.
- **2026-05-16** — Fonts: Fraunces (display) + Plus Jakarta Sans (body) — departs from Starlyn's Cormorant + DM Sans for a warmer, more contemporary editorial feel suited to the mountain lodge aesthetic.
- **2026-05-16** — Nav: Max 4 items enforced — Home / Rooms / Activities / Reserve. WhatsApp link in header.

---

## Files Created

_(none yet — starting Sprint 1.1)_

---

## Blocked Items

_(none yet)_

---

## Next Session

**Start at:** Phase 1, Sprint 1.1 — Repo init + design tokens
**Context:** Project directory exists at `/Users/tasfiqsunny/Documents/code/WebDev/2026/web-dev-agency/web-agency-nepali-hotel`. Nothing scaffolded yet. Sprint 1.1 creates the Next.js app, installs dependencies, writes globals.css with mountain hotel tokens, and configures tailwind.config.ts. Sprint 1.2 (can run in parallel if separate session) copies Starlyn's animation lib and wires SiteShell + layout.tsx. Sprint 1.3 sets up Drizzle + BetterAuth + the DB schema.
