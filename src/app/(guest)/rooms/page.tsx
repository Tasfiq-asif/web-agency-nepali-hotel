import { db } from '@/db';
import { rooms } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import { JsonLd } from '@/components/seo/JsonLd';
import { roomsListSchema } from '@/lib/schema';
import { ROOMS } from '@/data/rooms';
import { mergeRoom } from '@/lib/roomUtils';
import { getPageSeo } from '@/lib/getSeo';
import { RoomsClient } from './RoomsClient';

async function getRooms() {
  try {
    const rows = await db.select().from(rooms).where(eq(rooms.isActive, true)).orderBy(asc(rooms.name));
    return rows.length > 0 ? rows.map(mergeRoom) : ROOMS;
  } catch {
    return ROOMS;
  }
}

export async function generateMetadata() {
  return getPageSeo('rooms', {
    title: 'Rooms & Suites — Mountain Nest Hotel',
    description:
      'Six thoughtfully designed mountain rooms and suites in the Annapurna region of Nepal. From intimate garden retreats to panoramic Himalayan suites.',
  });
}

export default async function RoomsPage() {
  const roomList = await getRooms();
  return (
    <>
      <JsonLd data={roomsListSchema(roomList)} />
      <RoomsClient rooms={roomList} />
    </>
  );
}
