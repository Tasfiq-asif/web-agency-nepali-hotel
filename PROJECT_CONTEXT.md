# Mountain Nest Hotel — Build Context

Generated: 2026-05-16 | Last updated: 2026-05-17 (Sprint 6.1 — AvailabilityCalendar complete)

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
- **PostgreSQL** — self-hosted VPS (user provides DB_URL)
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
- **2026-05-16** — Fonts revised: Cormorant (display) + Jost (body) + DM Mono (labels). Replaced Fraunces (too quirky/wonky) and Plus Jakarta Sans (too startup-adjacent). Cormorant is old-style serif with artisanal, old-world warmth — italics available, weights 300–600. Jost is geometric humanist, clean and premium.
- **2026-05-16** — Font replaced again: Gloock → Cormorant. Gloock is single-weight with no italic support. Cormorant offers weights 300–600, normal + italic, same old-world warmth with far more flexibility.
- **2026-05-16** — Heading font-weight: 400 default; can use 300 or 500 with Cormorant (multi-weight).
- **2026-05-16** — Nav: Max 4 items enforced — Home / Rooms / Activities / Reserve. WhatsApp link in header.
- **2026-05-17** — next.config.ts: Added `dangerouslyAllowSVG` for placeholder room images. Remove this when real JPGs are added.
- **2026-05-17** — Room detail page split into server component (page.tsx) + client component (RoomDetailClient.tsx). Server side handles generateStaticParams, generateMetadata, and notFound(). Client side handles GSAP. This pattern should be used for all future detail pages.
- **2026-05-17** — RoomCardGrid placed between StatStrip and CTASection. Section rhythm: dark → ivory (rooms) → terracotta. Moved CTASection to follow rooms for natural "see rooms → reserve" flow.
- **2026-05-17** — AvailabilityCalendar built from scratch (not using react-day-picker). Full control over Cormorant italic month header, DM Mono day numbers, square cell geometry, half-gradient range bars at endpoints. API route at /api/availability returns blocked_dates + confirmed booking dates for a given roomSlug + date window. DB-not-connected error is caught and returns empty array so calendar renders in dev without a live DB.
- **2026-05-17** — /book page created as a test harness for the calendar. Will become the full multi-step booking flow in Sprint 6.2.
- **2026-05-17** — Awwwards quality pass: 9 targeted fixes applied. Hero headline `clamp(5rem, 13vw, 14rem)`. IntroStatement overlaps hero -100px with border-radius 24px. StatStrip is now full-bleed (no container cap). Gradient bridges on all section transitions via backgroundImage (no z-index conflicts). ActivityGrid emojis replaced with Cormorant italic numerals 01–06. GalleryMasonry grid bleeds past container. RoomCard hover orchestrates 3 properties via CSS (card, h3, price-row). CTA buttons use btn-wipe fill-wipe CSS class — JS color handlers removed. ScrollVelocityEffect applies skewY to .container divs (not section backgrounds) during fast scroll.

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
- `src/app/book/page.tsx` — placeholder /book page for calendar testing (will become full booking flow in Sprint 6.2)

---

## Blocked Items

_(none yet)_

---

## Next Session

**Start at:** Phase 6, Sprint 6.2 — BookingForm multi-step
**Context:** Sprint 6.1 complete. AvailabilityCalendar is built and tested: renders correctly, range selection with terracotta highlights works, API endpoint returns blocked + booked dates. /book page exists as a skeleton shell.

Sprint 6.2 builds the full multi-step BookingForm:
- Step 1: Dates → embeds AvailabilityCalendar, "Continue" only enabled when both check-in + check-out are set
- Step 2: Room selection → show available rooms for the selected dates (check against blocked dates/bookings), with RoomCard-style cards, pre-selects if ?room= param is in URL
- Step 3: Guest details → name, email, phone, nationality, adults/children, special requests
- Step 4: Confirm → summary of all selections, "Submit Enquiry" button → POST to /api/bookings
The form should live in src/components/sections/BookingForm.tsx (client component) and the /book page should render it.
