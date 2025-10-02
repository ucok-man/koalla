import { createTRPCRouter } from "../init";
import { configurationRouter } from "./configurations";
import { orderRouter } from "./order";
import { paymentRouter } from "./payments";
import { userRouter } from "./users";

export const appRouter = createTRPCRouter({
  user: userRouter,
  configuration: configurationRouter,
  payment: paymentRouter,
  order: orderRouter,
});

export type AppRouter = typeof appRouter;
