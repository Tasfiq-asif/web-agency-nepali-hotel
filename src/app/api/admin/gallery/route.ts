import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { galleryImages } from '@/db/schema';
import { asc, sql } from 'drizzle-orm';

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const rows = await db
      .select()
      .from(galleryImages)
      .orderBy(asc(galleryImages.sortOrder), asc(galleryImages.createdAt));
    return NextResponse.json({ images: rows });
  } catch (err) {
    console.error('[GET /api/admin/gallery]', err);
    return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 });
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

  const { url, alt, category } = body as { url?: unknown; alt?: unknown; category?: unknown };

  if (typeof url !== 'string' || !url.startsWith('http')) {
    return NextResponse.json({ error: 'url is required' }, { status: 400 });
  }

  try {
    const [{ count }] = await db
      .select({ count: sql<number>`cast(count(*) as int)` })
      .from(galleryImages);

    const [inserted] = await db
      .insert(galleryImages)
      .values({
        url,
        alt: typeof alt === 'string' && alt.trim() ? alt.trim() : '',
        category: typeof category === 'string' && category.trim() ? category.trim() : 'general',
        sortOrder: count,
      })
      .returning();

    return NextResponse.json({ image: inserted }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/admin/gallery]', err);
    return NextResponse.json({ error: 'Failed to save image' }, { status: 500 });
  }
}
