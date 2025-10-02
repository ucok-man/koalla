import { db } from "@/lib/db";
import sharp from "sharp";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import z from "zod";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const uploadImageRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .input(
      z.object({
        configId: z.string().trim().optional(),
      })
    )
    .middleware(async ({ input }) => {
      return {
        input: input,
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
