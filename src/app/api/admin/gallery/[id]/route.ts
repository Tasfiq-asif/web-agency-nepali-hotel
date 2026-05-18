import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { galleryImages } from '@/db/schema';
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

  const { alt, category, sortOrder } = body as {
    alt?: unknown;
    category?: unknown;
    sortOrder?: unknown;
  };

  const updates: Record<string, unknown> = {};
  if (typeof alt === 'string') updates.alt = alt.trim();
  if (typeof category === 'string' && category.trim()) updates.category = category.trim();
  if (typeof sortOrder === 'number') updates.sortOrder = sortOrder;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
  }

  try {
    const [updated] = await db
      .update(galleryImages)
      .set(updates)
      .where(eq(galleryImages.id, id))
      .returning();

    if (!updated) return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    return NextResponse.json({ image: updated });
  } catch (err) {
    console.error('[PATCH /api/admin/gallery/[id]]', err);
    return NextResponse.json({ error: 'Failed to update image' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  try {
    const [deleted] = await db
      .delete(galleryImages)
      .where(eq(galleryImages.id, id))
      .returning({ id: galleryImages.id });

    if (!deleted) return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[DELETE /api/admin/gallery/[id]]', err);
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
  }
}
