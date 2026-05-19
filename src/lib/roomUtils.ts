import type { Room } from '@/data/rooms';
import { ROOMS } from '@/data/rooms';

export interface DbRoomRow {
  id: string;
  slug: string;
  name: string;
  description: string;
  maxGuests: number;
  basePriceUsd: string;
  amenities: unknown;
  images: unknown;
  isActive: boolean;
}

export function mergeRoom(dbRow: DbRoomRow): Room {
  const staticRoom = ROOMS.find(r => r.slug === dbRow.slug);
  const imagesArr = Array.isArray(dbRow.images) ? (dbRow.images as { url: string }[]) : [];
  const imageSrc = imagesArr[0]?.url ?? staticRoom?.imageSrc ?? `/images/rooms/${dbRow.slug}.webp`;
  const amenities = Array.isArray(dbRow.amenities) ? (dbRow.amenities as string[]) : (staticRoom?.amenities ?? []);

  return {
    slug: dbRow.slug,
    name: dbRow.name,
    tagline: staticRoom?.tagline ?? dbRow.description.split('.')[0].trim(),
    description: dbRow.description,
    imageSrc,
    amenities,
    maxGuests: dbRow.maxGuests,
    pricePerNight: parseFloat(dbRow.basePriceUsd),
  };
}
