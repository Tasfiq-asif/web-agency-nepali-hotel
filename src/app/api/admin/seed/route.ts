import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { rooms } from '@/db/schema';
import { ROOMS } from '@/data/rooms';

export async function POST() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const values = ROOMS.map(r => ({
      slug: r.slug,
      name: r.name,
      description: r.description,
      maxGuests: r.maxGuests,
      basePriceUsd: r.pricePerNight.toFixed(2),
      amenities: r.amenities,
      images: [{ url: r.imageSrc, alt: r.name }],
      isActive: true,
    }));

    await db.insert(rooms).values(values).onConflictDoNothing();
    return NextResponse.json({ ok: true, seeded: values.length });
  } catch (err) {
    console.error('[POST /api/admin/seed]', err);
    return NextResponse.json({ error: 'Seed failed' }, { status: 500 });
  }
}
