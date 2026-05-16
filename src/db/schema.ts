import { pgTable, text, integer, boolean, timestamp, date, decimal, jsonb, serial } from 'drizzle-orm/pg-core';

// ─── BetterAuth managed tables ───
// BetterAuth generates its own migration for these — do not define here.
// user, session, account, verification tables are managed by better-auth.

// ─── Rooms ───

export const rooms = pgTable('rooms', {
  id:          text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  slug:        text('slug').notNull().unique(),
  name:        text('name').notNull(),
  description: text('description').notNull(),
  maxGuests:   integer('max_guests').notNull().default(2),
  basePriceUsd: decimal('base_price_usd', { precision: 10, scale: 2 }).notNull(),
  amenities:   jsonb('amenities').$type<string[]>().default([]),
  images:      jsonb('images').$type<{ url: string; alt: string }[]>().default([]),
  isActive:    boolean('is_active').notNull().default(true),
  createdAt:   timestamp('created_at').notNull().defaultNow(),
  updatedAt:   timestamp('updated_at').notNull().defaultNow(),
});

// ─── Bookings ───

export const bookings = pgTable('bookings', {
  id:              text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  roomId:          text('room_id').notNull().references(() => rooms.id),
  guestName:       text('guest_name').notNull(),
  guestEmail:      text('guest_email').notNull(),
  guestPhone:      text('guest_phone').notNull(),
  nationality:     text('nationality'),
  checkIn:         date('check_in').notNull(),
  checkOut:        date('check_out').notNull(),
  adults:          integer('adults').notNull().default(1),
  children:        integer('children').notNull().default(0),
  specialRequests: text('special_requests'),
  totalPriceUsd:   decimal('total_price_usd', { precision: 10, scale: 2 }),
  status:          text('status', { enum: ['pending', 'confirmed', 'cancelled'] }).notNull().default('pending'),
  adminNotes:      text('admin_notes'),
  createdAt:       timestamp('created_at').notNull().defaultNow(),
  updatedAt:       timestamp('updated_at').notNull().defaultNow(),
});

// ─── Blocked dates (per room or property-wide) ───

export const blockedDates = pgTable('blocked_dates', {
  id:        text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  roomId:    text('room_id').references(() => rooms.id), // null = all rooms
  date:      date('date').notNull(),
  reason:    text('reason'),
});

// ─── Seasonal pricing ───

export const seasonalPricing = pgTable('seasonal_pricing', {
  id:             text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  roomId:         text('room_id').notNull().references(() => rooms.id),
  startDate:      date('start_date').notNull(),
  endDate:        date('end_date').notNull(),
  pricePerNight:  decimal('price_per_night', { precision: 10, scale: 2 }).notNull(),
  label:          text('label'), // e.g. "Peak Season", "Monsoon"
});

// ─── Gallery ───

export const galleryImages = pgTable('gallery_images', {
  id:        text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  url:       text('url').notNull(),
  alt:       text('alt').notNull().default(''),
  category:  text('category').default('general'), // general, rooms, dining, activities
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ─── Page content (editable in admin) ───

export const pagesContent = pgTable('pages_content', {
  id:        serial('id').primaryKey(),
  pageKey:   text('page_key').notNull(),  // e.g. 'home', 'about', 'dining'
  field:     text('field').notNull(),     // e.g. 'heroHeadline', 'introText'
  value:     text('value').notNull(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ─── SEO meta (editable in admin) ───

export const pagesSeo = pgTable('pages_seo', {
  id:              serial('id').primaryKey(),
  pageKey:         text('page_key').notNull().unique(),
  metaTitle:       text('meta_title'),
  metaDescription: text('meta_description'),
  ogImage:         text('og_image'),
  updatedAt:       timestamp('updated_at').notNull().defaultNow(),
});
