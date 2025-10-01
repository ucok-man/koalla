import { db } from "@/lib/db";
import sharp from "sharp";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const uploadImageRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ input }) => {
      return {
        input: input as undefined | { configId: string },
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      if (metadata.input?.configId) {
        const config = await db.configuration.update({
          where: {
            id: metadata.input.configId,
          },
          data: {
            croppedImageUrl: file.ufsUrl,
          },
        });

        return { config };
      }

      const res = await fetch(file.ufsUrl);
      const buff = await res.arrayBuffer();
      const { width, height } = await sharp(buff).metadata();

      const config = await db.configuration.create({
        data: {
          height: height,
          width: width,
          imageUrl: file.ufsUrl,
        },
      });
      return { config };
    }),
} satisfies FileRouter;

export type UploadImageRouter = typeof uploadImageRouter;
