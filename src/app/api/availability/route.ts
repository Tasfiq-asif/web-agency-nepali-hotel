import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { rooms, blockedDates, bookings } from '@/db/schema';
import { and, eq, gte, isNull, lte, or } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const roomSlug = searchParams.get('roomSlug');
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  if (!from || !to) {
    return NextResponse.json({ error: 'from and to required' }, { status: 400 });
  }

  try {
    let roomId: string | null = null;

    if (roomSlug) {
      const [room] = await db
        .select({ id: rooms.id })
        .from(rooms)
        .where(eq(rooms.slug, roomSlug))
        .limit(1);
      if (room) roomId = room.id;
    }

    // Explicitly blocked dates (per-room or property-wide)
    const blockedRows = await db
      .select({ date: blockedDates.date })
      .from(blockedDates)
      .where(
        and(
          roomId
            ? or(eq(blockedDates.roomId, roomId), isNull(blockedDates.roomId))
            : isNull(blockedDates.roomId),
          gte(blockedDates.date, from),
          lte(blockedDates.date, to),
        )
      );

    const result = new Set(blockedRows.map(r => r.date));

    // Dates occupied by confirmed bookings
    if (roomId) {
      const confirmed = await db
        .select({ checkIn: bookings.checkIn, checkOut: bookings.checkOut })
        .from(bookings)
        .where(
          and(
            eq(bookings.roomId, roomId),
            eq(bookings.status, 'confirmed'),
            lte(bookings.checkIn, to),
            gte(bookings.checkOut, from),
          )
        );

      for (const b of confirmed) {
        const cur = new Date(b.checkIn);
        const end = new Date(b.checkOut);
        while (cur < end) {
          const iso = cur.toISOString().split('T')[0];
          if (iso >= from && iso <= to) result.add(iso);
          cur.setDate(cur.getDate() + 1);
        }
      }
    }

    return NextResponse.json({ blocked: Array.from(result) });
  } catch {
    // DB not available in dev — return empty so calendar still renders
    return NextResponse.json({ blocked: [] });
  }
}
