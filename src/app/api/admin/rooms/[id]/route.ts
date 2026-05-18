import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { rooms } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { name, description, maxGuests, basePriceUsd, amenities, isActive } = body as {
    name?: unknown;
    description?: unknown;
    maxGuests?: unknown;
    basePriceUsd?: unknown;
    amenities?: unknown;
    isActive?: unknown;
  };

  const updates: Record<string, unknown> = { updatedAt: new Date() };

  if (typeof name === 'string' && name.trim()) updates.name = name.trim();
  if (typeof description === 'string' && description.trim()) updates.description = description.trim();
  if (typeof maxGuests === 'number' && maxGuests > 0) updates.maxGuests = maxGuests;
  if (typeof basePriceUsd === 'number' && basePriceUsd > 0) {
    updates.basePriceUsd = basePriceUsd.toFixed(2);
  }
  if (Array.isArray(amenities)) updates.amenities = amenities;
  if (typeof isActive === 'boolean') updates.isActive = isActive;

  if (Object.keys(updates).length === 1) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
  }

  try {
    const [updated] = await db
      .update(rooms)
      .set(updates)
      .where(eq(rooms.id, id))
      .returning();

    if (!updated) return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    return NextResponse.json({ room: updated });
  } catch (err) {
    console.error('[PATCH /api/admin/rooms/[id]]', err);
    return NextResponse.json({ error: 'Failed to update room' }, { status: 500 });
  }
}
