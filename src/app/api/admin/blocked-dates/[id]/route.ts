import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { blockedDates } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    await db.delete(blockedDates).where(eq(blockedDates.id, id));
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[DELETE /api/admin/blocked-dates/:id]', err);
    return NextResponse.json({ error: 'Failed to delete blocked date' }, { status: 500 });
  }
}
