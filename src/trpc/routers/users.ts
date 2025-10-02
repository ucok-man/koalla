import z from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "../init";

export const userRouter = createTRPCRouter({
  sync: publicProcedure
    .input(
      z.object({
        id: z.string().trim().min(1, "id is required"),
        name: z.string().trim().min(1, "name is required"),
        email: z.email(),
        image: z.url().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.user.upsert({
        where: {
          id: input.id,
        },
        create: input,
        update: input,
      });
    }),

  isAdmin: privateProcedure.query(({ ctx }) => {
    return ctx.user.email === process.env.ADMIN_EMAIL;
  }),
});
