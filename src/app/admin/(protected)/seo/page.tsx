import type { Metadata } from 'next';
import { db } from '@/db';
import { pagesSeo } from '@/db/schema';
import { SeoEditor } from '@/components/admin/SeoEditor';

export const metadata: Metadata = { title: 'SEO | Admin' };

type SeoRow = {
  pageKey: string;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImage: string | null;
};

async function getSeo() {
  try {
    const rows = await db.select({
      pageKey:         pagesSeo.pageKey,
      metaTitle:       pagesSeo.metaTitle,
      metaDescription: pagesSeo.metaDescription,
      ogImage:         pagesSeo.ogImage,
    }).from(pagesSeo);

    const seoMap: Record<string, SeoRow> = {};
    for (const row of rows) seoMap[row.pageKey] = row;
    return { seo: seoMap, dbLive: true };
  } catch {
    return { seo: {}, dbLive: false };
  }
}

export default async function AdminSeoPage() {
  const { seo, dbLive } = await getSeo();

  return (
    <div style={{ padding: '2rem 2.5rem', maxWidth: 720 }}>
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
          SEO
        </h1>
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.625rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'rgba(245,240,232,0.35)',
        }}>
          Meta title · description · OG image — per page
          {!dbLive && (
            <span style={{ color: '#C4704F', marginLeft: '1rem' }}>DB OFFLINE</span>
          )}
        </p>
      </div>

      <SeoEditor initialSeo={seo} />
    </div>
  );
}
