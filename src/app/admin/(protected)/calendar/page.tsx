import type { Metadata } from 'next';
import { db } from '@/db';
import { rooms, blockedDates, seasonalPricing } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import { CalendarManager } from '@/components/admin/CalendarManager';

export const metadata: Metadata = { title: 'Calendar | Admin' };

async function getData() {
  try {
    const [roomRows, blockRows, pricingRows] = await Promise.all([
      db
        .select({ id: rooms.id, slug: rooms.slug, name: rooms.name })
        .from(rooms)
        .where(eq(rooms.isActive, true))
        .orderBy(asc(rooms.name)),

      db
        .select({
          id:     blockedDates.id,
          roomId: blockedDates.roomId,
          date:   blockedDates.date,
          reason: blockedDates.reason,
        })
        .from(blockedDates)
        .orderBy(asc(blockedDates.date)),

      db
        .select({
          id:            seasonalPricing.id,
          roomId:        seasonalPricing.roomId,
          startDate:     seasonalPricing.startDate,
          endDate:       seasonalPricing.endDate,
          pricePerNight: seasonalPricing.pricePerNight,
          label:         seasonalPricing.label,
          roomName:      rooms.name,
        })
        .from(seasonalPricing)
        .innerJoin(rooms, eq(seasonalPricing.roomId, rooms.id))
        .orderBy(asc(seasonalPricing.startDate)),
    ]);

    return { rooms: roomRows, blocks: blockRows, pricing: pricingRows, dbLive: true };
  } catch {
    return { rooms: [], blocks: [], pricing: [], dbLive: false };
  }
}

export default async function AdminCalendarPage() {
  const { rooms: roomList, blocks, pricing, dbLive } = await getData();

  return (
    <div style={{ padding: '2rem 2.5rem', maxWidth: 1100 }}>
      <div style={{
        marginBottom: '1.75rem',
        paddingBottom: '1.5rem',
        borderBottom: '1px solid rgba(221,216,206,0.1)',
      }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontWeight: 300,
          fontSize: '2.25rem',
          color: '#F5F0E8',
          lineHeight: 1.1,
          marginBottom: '0.375rem',
        }}>
          Calendar
        </h1>
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.625rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'rgba(245,240,232,0.35)',
        }}>
          Block dates · Seasonal pricing
          {!dbLive && (
            <span style={{ color: '#C4704F', marginLeft: '1rem' }}>DB OFFLINE</span>
          )}
        </p>
      </div>

      <CalendarManager rooms={roomList} initialBlocks={blocks} initialPricing={pricing} />
    </div>
  );
}
