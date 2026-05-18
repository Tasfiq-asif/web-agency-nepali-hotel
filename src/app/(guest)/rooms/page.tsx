import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { roomsListSchema } from '@/lib/schema';
import { ROOMS } from '@/data/rooms';
import { RoomsClient } from './RoomsClient';

export const metadata: Metadata = {
  title: 'Rooms & Suites — Mountain Nest Hotel',
  description:
    'Six thoughtfully designed mountain rooms and suites in the Annapurna region of Nepal. From intimate garden retreats to panoramic Himalayan suites.',
};

export default function RoomsPage() {
  return (
    <>
      <JsonLd data={roomsListSchema(ROOMS)} />
      <RoomsClient />
    </>
  );
}
