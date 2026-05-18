import type { Metadata } from 'next';
import { db } from '@/db';
import { rooms } from '@/db/schema';
import { asc } from 'drizzle-orm';
import { RoomEditorForm } from '@/components/admin/RoomEditorForm';

export const metadata: Metadata = { title: 'Rooms | Admin' };

async function getRooms() {
  try {
    const rows = await db.select().from(rooms).orderBy(asc(rooms.name));
    return { rooms: rows, dbLive: true };
  } catch {
    return { rooms: [], dbLive: false };
  }
}

export default async function AdminRoomsPage() {
  const { rooms: roomList, dbLive } = await getRooms();

  return (
    <div style={{ padding: '2rem 2.5rem', maxWidth: 900 }}>
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
          Rooms
        </h1>
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.625rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'rgba(245,240,232,0.35)',
        }}>
          Edit name · description · amenities · pricing
          {!dbLive && (
            <span style={{ color: '#C4704F', marginLeft: '1rem' }}>DB OFFLINE</span>
          )}
        </p>
      </div>

      <RoomEditorForm initialRooms={roomList} />
    </div>
  );
}
