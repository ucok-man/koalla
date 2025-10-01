import { createRouteHandler } from "uploadthing/next";
import { uploadImageRouter } from "./core";

export const { GET, POST } = createRouteHandler({
  router: uploadImageRouter,
});
