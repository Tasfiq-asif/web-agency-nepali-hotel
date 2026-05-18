import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from '@uploadthing/shared';
import { auth } from '@/lib/auth';

const f = createUploadthing();

export const ourFileRouter = {
  galleryImage: f({ image: { maxFileSize: '4MB', maxFileCount: 10 } })
    .middleware(async ({ req }) => {
      const session = await auth.api.getSession({ headers: req.headers });
      if (!session) throw new UploadThingError('Unauthorized');
      return {};
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.ufsUrl, name: file.name };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
