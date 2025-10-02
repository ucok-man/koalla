import { createTRPCRouter } from "../init";
import { configurationRouter } from "./configurations";
import { paymentRouter } from "./payments";
import { userRouter } from "./users";

export const appRouter = createTRPCRouter({
  user: userRouter,
  configuration: configurationRouter,
  payment: paymentRouter,
});

export type AppRouter = typeof appRouter;
