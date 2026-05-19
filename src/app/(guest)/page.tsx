import { db } from '@/db';
import { rooms } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import { ROOMS } from '@/data/rooms';
import { mergeRoom } from '@/lib/roomUtils';
import { HeroFullscreen } from '@/components/sections/HeroFullscreen';
import { IntroStatement } from '@/components/sections/IntroStatement';
import { StatStrip } from '@/components/sections/StatStrip';
import { RoomCardGrid } from '@/components/sections/RoomCardGrid';
import { FeatureSplit } from '@/components/sections/FeatureSplit';
import { ActivityGrid } from '@/components/sections/ActivityGrid';
import { TestimonialCarousel } from '@/components/sections/TestimonialCarousel';
import { GalleryMasonry } from '@/components/sections/GalleryMasonry';
import { CTASection } from '@/components/sections/CTASection';
import { JsonLd } from '@/components/seo/JsonLd';
import { hotelSchema } from '@/lib/schema';

async function getRooms() {
  try {
    const rows = await db.select().from(rooms).where(eq(rooms.isActive, true)).orderBy(asc(rooms.name));
    return rows.length > 0 ? rows.map(mergeRoom) : ROOMS;
  } catch {
    return ROOMS;
  }
}

export default async function Home() {
  const roomList = await getRooms();
  return (
    <>
      <JsonLd data={hotelSchema()} />
      <main id="main-content">
        <HeroFullscreen />
        <IntroStatement />
        <StatStrip />
        <RoomCardGrid rooms={roomList} />
        <FeatureSplit />
        <ActivityGrid />
        <GalleryMasonry />
        <TestimonialCarousel />
        <CTASection />
      </main>
    </>
  );
}
