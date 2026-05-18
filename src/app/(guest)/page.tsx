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

export default function Home() {
  return (
    <>
      <JsonLd data={hotelSchema()} />
      <main id="main-content">
      <HeroFullscreen />
      <IntroStatement />
      <StatStrip />
      <RoomCardGrid />
      <FeatureSplit />
      <ActivityGrid />
      <GalleryMasonry />
      <TestimonialCarousel />
      <CTASection />
    </main>
    </>
  );
}
