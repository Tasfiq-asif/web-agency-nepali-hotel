import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { pagesSeo } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ pageKey: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { pageKey } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { metaTitle, metaDescription, ogImage } = body as {
    metaTitle?: unknown;
    metaDescription?: unknown;
    ogImage?: unknown;
  };

  const updates: Record<string, unknown> = { updatedAt: new Date() };
  if (typeof metaTitle === 'string') updates.metaTitle = metaTitle.trim() || null;
  if (typeof metaDescription === 'string') updates.metaDescription = metaDescription.trim() || null;
  if (typeof ogImage === 'string') updates.ogImage = ogImage.trim() || null;

  try {
    const existing = await db
      .select({ id: pagesSeo.id })
      .from(pagesSeo)
      .where(eq(pagesSeo.pageKey, pageKey))
      .limit(1);

    if (existing.length > 0) {
      await db.update(pagesSeo).set(updates).where(eq(pagesSeo.pageKey, pageKey));
    } else {
      await db.insert(pagesSeo).values({
        pageKey,
        metaTitle: typeof metaTitle === 'string' ? metaTitle.trim() || null : null,
        metaDescription: typeof metaDescription === 'string' ? metaDescription.trim() || null : null,
        ogImage: typeof ogImage === 'string' ? ogImage.trim() || null : null,
        updatedAt: new Date(),
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[PATCH /api/admin/seo/[pageKey]]', err);
    return NextResponse.json({ error: 'Failed to save SEO' }, { status: 500 });
  }
}
