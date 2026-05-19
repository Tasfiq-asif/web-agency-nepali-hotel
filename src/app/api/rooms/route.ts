import { NextResponse } from 'next/server';
import { db } from '@/db';
import { rooms } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import { ROOMS } from '@/data/rooms';
import { mergeRoom } from '@/lib/roomUtils';
import type { Room } from '@/data/rooms';

export async function GET() {
  try {
    const rows = await db.select().from(rooms).where(eq(rooms.isActive, true)).orderBy(asc(rooms.name));
    const roomList: Room[] = rows.length > 0 ? rows.map(mergeRoom) : ROOMS;
    return NextResponse.json({ rooms: roomList });
  } catch {
    return NextResponse.json({ rooms: ROOMS });
  }
}
