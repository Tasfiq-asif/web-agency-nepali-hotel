import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { seasonalPricing } from '@/db/schema';
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
    await db.delete(seasonalPricing).where(eq(seasonalPricing.id, id));
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[DELETE /api/admin/seasonal-pricing/:id]', err);
    return NextResponse.json({ error: 'Failed to delete pricing rule' }, { status: 500 });
  }
}
