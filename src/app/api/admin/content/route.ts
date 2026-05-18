import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { pagesContent } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const rows = await db.select().from(pagesContent);
    // Group by pageKey → { [pageKey]: { [field]: value } }
    const grouped: Record<string, Record<string, string>> = {};
    for (const row of rows) {
      if (!grouped[row.pageKey]) grouped[row.pageKey] = {};
      grouped[row.pageKey][row.field] = row.value;
    }
    return NextResponse.json({ content: grouped });
  } catch (err) {
    console.error('[GET /api/admin/content]', err);
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { pageKey, fields } = body as { pageKey?: unknown; fields?: unknown };

  if (typeof pageKey !== 'string' || !pageKey.trim()) {
    return NextResponse.json({ error: 'pageKey required' }, { status: 400 });
  }
  if (typeof fields !== 'object' || fields === null || Array.isArray(fields)) {
    return NextResponse.json({ error: 'fields must be an object' }, { status: 400 });
  }

  const fieldMap = fields as Record<string, unknown>;
  const now = new Date();

  try {
    for (const [field, rawValue] of Object.entries(fieldMap)) {
      if (typeof rawValue !== 'string') continue;
      const value = rawValue;

      const existing = await db
        .select({ id: pagesContent.id })
        .from(pagesContent)
        .where(and(eq(pagesContent.pageKey, pageKey), eq(pagesContent.field, field)))
        .limit(1);

      if (existing.length > 0) {
        await db
          .update(pagesContent)
          .set({ value, updatedAt: now })
          .where(and(eq(pagesContent.pageKey, pageKey), eq(pagesContent.field, field)));
      } else {
        await db.insert(pagesContent).values({ pageKey, field, value, updatedAt: now });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[POST /api/admin/content]', err);
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 });
  }
}
