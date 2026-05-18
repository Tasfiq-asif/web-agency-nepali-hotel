import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { pagesSeo } from '@/db/schema';

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const rows = await db.select().from(pagesSeo);
    return NextResponse.json({ seo: rows });
  } catch (err) {
    console.error('[GET /api/admin/seo]', err);
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }
}
