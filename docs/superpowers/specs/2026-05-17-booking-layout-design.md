# Desktop Booking Layout Redesign — Design Spec
Date: 2026-05-17
Status: Approved

---

## Problem

The `/book` page uses a narrow 680px centered container, leaving ~40% dead whitespace on either side at 1440px. The single-column layout feels like a utility form rather than a premium hotel booking experience.

## Solution

A full-viewport split-panel layout at `≥ 1024px`: 52% form (left), 48% live summary (right). The right panel builds progressively as the guest fills in details, making the booking process feel alive and confirming rather than transactional.

---

## Layout & Structure

- **Breakpoint**: `>= 1024px` — split layout activates. Below 1024px, existing single-column mobile layout is unchanged.
- **Left panel (52%)**: Contains the multi-step form. Scrolls internally if content overflows (unlikely — each step is a single focused task). Step indicator pinned at top. Back/Continue nav pinned at bottom.
- **Right panel (48%)**: Fixed/sticky to viewport height. Never scrolls. Shows hotel imagery and progressive booking summary.
- **Page scroll**: Disabled on the booking page at desktop — both panels fill 100vh.
- **Nav**: Site navbar sits above both panels as normal.

---

## Right Panel — 4 States

### State 1: Step 1, no dates selected
- **Top area**: Rotating hotel slideshow — 3–4 landscape/exterior/room photos cycling at 4s intervals with CSS crossfade (no JS library needed)
- **Bottom section**: Muted hint text "Select dates to begin →" in `--color-text-secondary`, Jost 300

### State 2: Step 1, dates chosen
- **Top area**: Slideshow continues uninterrupted
- **Bottom section**: Check-in date, Check-out date, nights count fill in with a subtle fade. Guests row shows current count. Room row shows "— choose a room" placeholder.

### State 3: Step 2+, room selected
- **Top area**: Selected room's image fades in (replacing slideshow). Static. Shows room name + tagline overlaid at bottom in a subtle gradient scrim.
- **Bottom section**: Full summary — check-in, check-out, nights, room name, guests, estimated total (price × nights). Total in `--color-accent` (terracotta).

### State 4: Step 2+, no room selected yet
- **Top area**: Blurred atmospheric photo (first slideshow image, CSS `filter: blur(8px)`) with "Choose a room →" overlay centered
- **Bottom section**: Dates visible, room row shows "—", total shows "—"

---

## Left Panel — Step-by-Step Form

### Step Indicator
Horizontal 4-node track pinned at top of left panel. Nodes: ● done (filled terracotta + ✓) | ● active (filled terracotta) | ○ todo (hollow hairline). Labels: Dates / Room / Details / Confirm in Jost 400 12px uppercase tracking-widest.

### Step 1 — Dates
- AvailabilityCalendar component centered in panel
- Continue button activates once both check-in and check-out are selected
- Right panel begins building summary on date selection

### Step 2 — Room
- Room cards stacked vertically
- Each card: room image (left, 120px wide) + name, tagline, price/night (right)
- Selected state: terracotta left border (3px) + light terracotta background tint
- Availability badge overlaid on image (same as existing mobile card pattern)
- Right panel top switches from slideshow → room image on selection

### Step 3 — Details
- Fields: Full Name, Email, Phone, Nationality (2-column grid for short fields), Special Requests (full-width textarea)
- Guest count stepper (Adults / Children) — same stepper component as current mobile
- All existing validation logic unchanged

### Step 4 — Confirm
- Read-only summary of all selections (dates, room, guests, guest info)
- "Confirm & Reserve" CTA — full-width terracotta fill button, Jost 500
- Right panel: final pricing breakdown

### Navigation
- **Back**: Text link, left-aligned, Jost 400, `--color-text-secondary`. Hidden on Step 1.
- **Continue / Confirm**: Terracotta fill button (`btn-wipe` class), right-aligned. Disabled when step validation fails.
- Both pinned to bottom of left panel.

---

## What Doesn't Change

- Mobile layout (< 1024px): unchanged — existing single-column with segmented 4-bar step indicator
- Form validation logic: `step1Valid`, `step2Valid`, `step3Valid` conditions unchanged
- Submit: `POST /api/bookings` unchanged
- Success state: unchanged
- All 4 steps, all fields, all room data: unchanged

---

## Component Changes

### `BookPage` (`/src/app/book/page.tsx`)
- Remove `maxWidth: 680` container constraint
- Remove section padding — full-viewport layout handles its own spacing
- Pass `initialRoom` prop as before

### `BookingForm` (`/src/components/sections/BookingForm.tsx`)
- Add desktop split-panel wrapper: `flex, h-screen, overflow-hidden` at `lg:`
- Left panel: `w-[52%]`, flex column, overflow-y auto
- Right panel: `w-[48%]`, fixed height, no scroll — new `BookingSummaryPanel` component or inline JSX
- `useMobile()` hook: change breakpoint to `1024px` (was `768px`) to match new split threshold
- Right panel state logic: derived from existing `step`, `data.checkIn`, `data.checkOut`, `data.roomSlug`
- Slideshow: plain array of 3–4 image paths, `setInterval` cycling, CSS `opacity` transition — no external library

### No new files required
All changes contained in `BookingForm.tsx` and `book/page.tsx`.

---

## Design Tokens Applied

| Element | Token |
|---|---|
| Left panel background | `--color-canvas` |
| Right panel background | `--color-ink` (dark) |
| Summary labels | `--color-text-secondary` (lightened for dark bg) |
| Summary values | white |
| Selected room border | `--color-accent` |
| Total price | `--color-accent` |
| Step node active | `--color-accent` |
| Step node done | `--color-accent` |
| Step node todo | `--color-hairline` |
| CTA button | `btn-wipe` (existing class) |

---

## Out of Scope

- Animated room card transitions
- Room photo gallery/lightbox in right panel
- Mobile layout changes
- `/api/bookings` route (Sprint 6.3)
- Email triggers (Sprint 6.3)
