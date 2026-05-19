import { BookingForm } from '@/components/sections/BookingForm';
import { getPageSeo } from '@/lib/getSeo';

interface Props {
  searchParams: Promise<{ room?: string }>;
}

export async function generateMetadata() {
  return getPageSeo('book', {
    title: 'Reserve Your Stay — Mountain Nest Hotel',
    description: 'Reserve a room at Mountain Nest Hotel. Direct booking — no OTA commissions.',
  });
}

export default async function BookPage({ searchParams }: Props) {
  const params = await searchParams;
  return (
    <main id="main-content">
      <BookingForm initialRoom={params.room} />
    </main>
  );
}
