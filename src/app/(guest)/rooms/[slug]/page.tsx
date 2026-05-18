import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ROOMS } from '@/data/rooms';
import { RoomDetailClient } from './RoomDetailClient';
import { JsonLd } from '@/components/seo/JsonLd';
import { roomSchema } from '@/lib/schema';

export function generateStaticParams() {
  return ROOMS.map((room) => ({ slug: room.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const room = ROOMS.find((r) => r.slug === slug);
  if (!room) return {};
  return {
    title: room.name,
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
  const room = ROOMS.find((r) => r.slug === slug);
  if (!room) notFound();
  return (
    <>
      <JsonLd data={roomSchema(room)} />
      <RoomDetailClient room={room} />
    </>
  );
}
