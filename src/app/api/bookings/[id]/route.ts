import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { bookings, rooms } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const [row] = await db
      .select({
        id:         bookings.id,
        status:     bookings.status,
        checkIn:    bookings.checkIn,
        checkOut:   bookings.checkOut,
        guestName:  bookings.guestName,
        guestEmail: bookings.guestEmail,
        adults:     bookings.adults,
        children:   bookings.children,
        roomName:   rooms.name,
        roomSlug:   rooms.slug,
        totalPriceUsd: bookings.totalPriceUsd,
        createdAt:  bookings.createdAt,
      })
      .from(bookings)
      .leftJoin(rooms, eq(bookings.roomId, rooms.id))
      .where(eq(bookings.id, id))
      .limit(1);

    if (!row) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json(row);
  } catch (err) {
    console.error('[GET /api/bookings/[id]]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
