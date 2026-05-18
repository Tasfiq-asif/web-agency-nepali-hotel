import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { bookings } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const action = (body as Record<string, unknown>).action;
  if (action !== 'confirm' && action !== 'cancel') {
    return NextResponse.json({ error: 'action must be confirm or cancel' }, { status: 400 });
  }

  const newStatus = action === 'confirm' ? 'confirmed' : 'cancelled';

  try {
    const [updated] = await db
      .update(bookings)
      .set({ status: newStatus, updatedAt: new Date() })
      .where(eq(bookings.id, id))
      .returning({ id: bookings.id, status: bookings.status });

    if (!updated) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({ id: updated.id, status: updated.status });
  } catch (err) {
    console.error('[PATCH /api/admin/bookings/:id]', err);
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}
