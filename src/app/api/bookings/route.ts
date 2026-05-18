import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { bookings, rooms } from '@/db/schema';
import { and, eq, lt, gt } from 'drizzle-orm';
import { sendBookingEmails } from '@/lib/email';

// ── Validation ──────────────────────────────────────────────────────────────────

function isISODate(s: unknown): s is string {
  return typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s);
}

function nightsBetween(checkIn: string, checkOut: string): number {
  return Math.round(
    (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000
  );
}

// ── POST /api/bookings ──────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const b = body as Record<string, unknown>;

  // ── Field validation ──────────────────────────────────────────────────────────
  const errors: string[] = [];

  if (!isISODate(b.checkIn))  errors.push('checkIn must be YYYY-MM-DD');
  if (!isISODate(b.checkOut)) errors.push('checkOut must be YYYY-MM-DD');
  if (typeof b.roomSlug !== 'string' || !b.roomSlug.trim()) errors.push('roomSlug required');
  if (typeof b.fullName !== 'string' || b.fullName.trim().length < 2) errors.push('fullName required');
  if (typeof b.email !== 'string' || !/\S+@\S+\.\S+/.test(b.email)) errors.push('valid email required');
  if (typeof b.phone !== 'string' || b.phone.trim().length < 5) errors.push('phone required');

  if (errors.length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const checkIn  = b.checkIn  as string;
  const checkOut = b.checkOut as string;
  const nights   = nightsBetween(checkIn, checkOut);

  if (nights < 1) {
    return NextResponse.json({ error: 'Check-out must be after check-in' }, { status: 400 });
  }

  try {
    // ── Resolve room ──────────────────────────────────────────────────────────
    const [room] = await db
      .select({ id: rooms.id, name: rooms.name, basePriceUsd: rooms.basePriceUsd })
      .from(rooms)
      .where(eq(rooms.slug, b.roomSlug as string))
      .limit(1);

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    // ── Conflict check (confirmed bookings only) ──────────────────────────────
    const conflicts = await db
      .select({ id: bookings.id })
      .from(bookings)
      .where(
        and(
          eq(bookings.roomId, room.id),
          eq(bookings.status, 'confirmed'),
          // overlap: existing.checkIn < our checkOut AND existing.checkOut > our checkIn
          lt(bookings.checkIn,  checkOut),
          gt(bookings.checkOut, checkIn),
        )
      )
      .limit(1);

    if (conflicts.length > 0) {
      return NextResponse.json(
        { error: 'Selected dates are no longer available. Please choose different dates.' },
        { status: 409 }
      );
    }

    // ── Calculate total ───────────────────────────────────────────────────────
    const totalUsd = parseFloat(room.basePriceUsd) * nights;

    // ── Insert booking ────────────────────────────────────────────────────────
    const [inserted] = await db
      .insert(bookings)
      .values({
        roomId:          room.id,
        guestName:       (b.fullName    as string).trim(),
        guestEmail:      (b.email       as string).trim().toLowerCase(),
        guestPhone:      (b.phone       as string).trim(),
        nationality:     typeof b.nationality     === 'string' ? b.nationality.trim()     || null : null,
        specialRequests: typeof b.specialRequests === 'string' ? b.specialRequests.trim() || null : null,
        checkIn,
        checkOut,
        adults:       typeof b.adults   === 'number' ? b.adults   : 1,
        children:     typeof b.children === 'number' ? b.children : 0,
        totalPriceUsd: totalUsd.toFixed(2),
        status:       'pending',
      })
      .returning({ id: bookings.id });

    // ── Send emails (fire-and-forget — don't block the response) ─────────────
    sendBookingEmails({
      bookingId:       inserted.id,
      guestName:       (b.fullName as string).trim(),
      guestEmail:      (b.email    as string).trim().toLowerCase(),
      guestPhone:      (b.phone    as string).trim(),
      nationality:     typeof b.nationality === 'string' ? b.nationality.trim() || null : null,
      roomName:        room.name,
      checkIn,
      checkOut,
      nights,
      adults:          typeof b.adults   === 'number' ? b.adults   : 1,
      children:        typeof b.children === 'number' ? b.children : 0,
      totalUsd,
      specialRequests: typeof b.specialRequests === 'string' ? b.specialRequests.trim() || null : null,
    });

    return NextResponse.json({ id: inserted.id }, { status: 201 });

  } catch (err) {
    console.error('[POST /api/bookings]', err);
    return NextResponse.json(
      { error: 'Unable to process your reservation. Please try again or contact us directly.' },
      { status: 500 }
    );
  }
}
