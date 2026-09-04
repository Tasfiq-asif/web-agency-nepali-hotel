import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { rooms } from '@/db/schema';
import { asc } from 'drizzle-orm';

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const rows = await db
      .select()
      .from(rooms)
      .orderBy(asc(rooms.name));
    return NextResponse.json({ rooms: rows });
  } catch (err) {
    console.error('[GET /api/admin/rooms]', err);
    return NextResponse.json({ error: 'Failed to fetch rooms' }, { status: 500 });
  }
}
