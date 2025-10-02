import { TRPCError } from "@trpc/server";
import z from "zod";
import { createTRPCRouter, privateProcedure } from "../init";

export const orderRouter = createTRPCRouter({
  getById: privateProcedure
    .input(
      z.object({
        oid: z.string().trim().min(1, "order id is required"),
      })
    )
    .query(async ({ ctx, input }) => {
      const { user, db } = ctx;
      const { oid } = input;

      const order = await db.order.findFirst({
        where: { id: oid, userId: user.id },
        include: {
          configuration: true,
          shippingAddress: true,
          user: true,
        },
      });

      if (!order) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Order not found for id #${oid}`,
        });
      }

      return order;
    }),
});
