import { createTRPCRouter } from "../init";
import { userRouter } from "./users";

export const appRouter = createTRPCRouter({
  user: userRouter,
});

export type AppRouter = typeof appRouter;
