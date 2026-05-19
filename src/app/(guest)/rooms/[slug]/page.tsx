import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { db } from '@/db';
import { rooms as roomsTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { ROOMS, type Room } from '@/data/rooms';
import { mergeRoom } from '@/lib/roomUtils';
import { RoomDetailClient } from './RoomDetailClient';
import { JsonLd } from '@/components/seo/JsonLd';
import { roomSchema } from '@/lib/schema';

async function getRoom(slug: string): Promise<Room | null> {
  try {
    const [dbRow] = await db.select().from(roomsTable).where(eq(roomsTable.slug, slug)).limit(1);
    if (dbRow) return mergeRoom(dbRow);
  } catch {}
  return ROOMS.find(r => r.slug === slug) ?? null;
}

export function generateStaticParams() {
  return ROOMS.map(r => ({ slug: r.slug }));
}

export const dynamicParams = true;

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const room = await getRoom(slug);
  if (!room) return {};
  return {
    title: `${room.name} — Mountain Nest Hotel`,
    description: room.tagline,
    openGraph: {
      title: `${room.name} — Mountain Nest Hotel`,
      description: room.tagline,
      images: [{ url: room.imageSrc }],
    },
  };
}

export default async function RoomPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const room = await getRoom(slug);
  if (!room) notFound();
  return (
    <>
      <JsonLd data={roomSchema(room)} />
      <RoomDetailClient room={room} />
    </>
  );
}
