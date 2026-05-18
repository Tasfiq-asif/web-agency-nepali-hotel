import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { seasonalPricing, rooms } from '@/db/schema';
import { eq } from 'drizzle-orm';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { roomId, startDate, endDate, pricePerNight, label } = body as {
    roomId?: unknown;
    startDate?: unknown;
    endDate?: unknown;
    pricePerNight?: unknown;
    label?: unknown;
  };

  if (typeof roomId !== 'string' || !roomId) {
    return NextResponse.json({ error: 'roomId is required' }, { status: 400 });
  }
  if (typeof startDate !== 'string' || !DATE_RE.test(startDate)) {
    return NextResponse.json({ error: 'startDate must be YYYY-MM-DD' }, { status: 400 });
  }
  if (typeof endDate !== 'string' || !DATE_RE.test(endDate)) {
    return NextResponse.json({ error: 'endDate must be YYYY-MM-DD' }, { status: 400 });
  }
  if (startDate >= endDate) {
    return NextResponse.json({ error: 'endDate must be after startDate' }, { status: 400 });
  }
  if (typeof pricePerNight !== 'number' || pricePerNight <= 0) {
    return NextResponse.json({ error: 'pricePerNight must be a positive number' }, { status: 400 });
  }

  try {
    const [inserted] = await db
      .insert(seasonalPricing)
      .values({
        roomId,
        startDate,
        endDate,
        pricePerNight: pricePerNight.toFixed(2),
        label: typeof label === 'string' && label.trim() ? label.trim() : null,
      })
      .returning();

    const [rule] = await db
      .select({
        id:             seasonalPricing.id,
        roomId:         seasonalPricing.roomId,
        startDate:      seasonalPricing.startDate,
        endDate:        seasonalPricing.endDate,
        pricePerNight:  seasonalPricing.pricePerNight,
        label:          seasonalPricing.label,
        roomName:       rooms.name,
      })
      .from(seasonalPricing)
      .innerJoin(rooms, eq(seasonalPricing.roomId, rooms.id))
      .where(eq(seasonalPricing.id, inserted.id));

    return NextResponse.json({ rule });
  } catch (err) {
    console.error('[POST /api/admin/seasonal-pricing]', err);
    return NextResponse.json({ error: 'Failed to save pricing rule' }, { status: 500 });
  }
}
