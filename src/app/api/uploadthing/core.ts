import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import sharp from "sharp";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

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
      const { userId } = await auth();
      if (!userId) throw new UploadThingError("Unauthorized");

      return { userId: userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
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
      return { config, userId: metadata.userId };
    }),
} satisfies FileRouter;

export type UploadImageRouter = typeof uploadImageRouter;
