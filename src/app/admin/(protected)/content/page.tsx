import type { Metadata } from 'next';
import { db } from '@/db';
import { pagesContent } from '@/db/schema';
import { ContentEditor } from '@/components/admin/ContentEditor';

export const metadata: Metadata = { title: 'Content | Admin' };

async function getContent() {
  try {
    const rows = await db.select().from(pagesContent);
    const grouped: Record<string, Record<string, string>> = {};
    for (const row of rows) {
      if (!grouped[row.pageKey]) grouped[row.pageKey] = {};
      grouped[row.pageKey][row.field] = row.value;
    }
    return { content: grouped, dbLive: true };
  } catch {
    return { content: {}, dbLive: false };
  }
}

export default async function AdminContentPage() {
  const { content, dbLive } = await getContent();

  return (
    <div style={{ padding: '2rem 2.5rem', maxWidth: 860 }}>
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
          Content
        </h1>
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.625rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'rgba(245,240,232,0.35)',
        }}>
          Edit page copy · headlines · body text
          {!dbLive && (
            <span style={{ color: '#C4704F', marginLeft: '1rem' }}>DB OFFLINE</span>
          )}
        </p>
      </div>

      <ContentEditor initialContent={content} />
    </div>
  );
}
