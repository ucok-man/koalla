import { createTRPCRouter } from "../init";
import { configurationRouter } from "./configurations";
import { userRouter } from "./users";

export const appRouter = createTRPCRouter({
  user: userRouter,
  configuration: configurationRouter,
});

export type AppRouter = typeof appRouter;
