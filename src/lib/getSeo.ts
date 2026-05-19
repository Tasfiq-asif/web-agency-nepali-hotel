import { db } from '@/db';
import { pagesSeo } from '@/db/schema';
import { eq } from 'drizzle-orm';
import type { Metadata } from 'next';

const SITE_NAME = 'Mountain Nest Hotel';

interface SeoFallback {
  title: string;
  description: string;
  ogImage?: string;
}

export async function getPageSeo(pageKey: string, fallback: SeoFallback): Promise<Metadata> {
  let dbTitle: string | null = null;
  let dbDesc: string | null = null;
  let dbOg: string | null = null;

  try {
    const [row] = await db
      .select({ metaTitle: pagesSeo.metaTitle, metaDescription: pagesSeo.metaDescription, ogImage: pagesSeo.ogImage })
      .from(pagesSeo)
      .where(eq(pagesSeo.pageKey, pageKey))
      .limit(1);

    if (row) {
      dbTitle = row.metaTitle;
      dbDesc = row.metaDescription;
      dbOg = row.ogImage;
    }
  } catch {
    // DB offline — use fallback
  }

  const title = dbTitle ?? fallback.title;
  const description = dbDesc ?? fallback.description;
  const ogImage = dbOg ?? fallback.ogImage;

  return {
    title,
    description,
    openGraph: {
      siteName: SITE_NAME,
      title: `${title} — ${SITE_NAME}`,
      description,
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
  };
}
