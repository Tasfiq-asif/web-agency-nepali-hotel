import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { blockedDates } from '@/db/schema';

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

  const { dates, roomId, reason } = body as {
    dates?: unknown;
    roomId?: unknown;
    reason?: unknown;
  };

  if (!Array.isArray(dates) || dates.length === 0) {
    return NextResponse.json({ error: 'dates must be a non-empty array' }, { status: 400 });
  }
  if (!dates.every(d => typeof d === 'string' && DATE_RE.test(d))) {
    return NextResponse.json({ error: 'All dates must be YYYY-MM-DD strings' }, { status: 400 });
  }
  if (roomId !== null && roomId !== undefined && typeof roomId !== 'string') {
    return NextResponse.json({ error: 'roomId must be a string or null' }, { status: 400 });
  }

  const rows = (dates as string[]).map(date => ({
    roomId: typeof roomId === 'string' ? roomId : null,
    date,
    reason: typeof reason === 'string' && reason.trim() ? reason.trim() : null,
  }));

  try {
    const inserted = await db.insert(blockedDates).values(rows).returning();
    return NextResponse.json({ inserted });
  } catch (err) {
    console.error('[POST /api/admin/blocked-dates]', err);
    return NextResponse.json({ error: 'Failed to insert blocked dates' }, { status: 500 });
  }
}
