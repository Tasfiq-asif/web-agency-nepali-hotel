import { BookingForm } from '@/components/sections/BookingForm';

interface Props {
  searchParams: Promise<{ room?: string }>;
}

export const metadata = {
  title: 'Reserve Your Stay — Mountain Nest Hotel',
  description: 'Reserve a room at Mountain Nest Hotel. Direct booking — no OTA commissions.',
};

export default async function BookPage({ searchParams }: Props) {
  const params = await searchParams;
  return (
    <main>
      <BookingForm initialRoom={params.room} />
    </main>
  );
}
