import { OrderStatus } from "@prisma/client";
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

  getDashboardOrders: privateProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(5),
        search: z.string().optional(),
        status: z
          .enum(["all", "fulfilled", "shipped", "awaiting_shipment"])
          .default("all"),
        sortOrder: z.enum(["asc", "desc"]).default("desc"),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, limit, search, status, sortOrder } = input;
      const skip = (page - 1) * limit;

      // Build where clause
      const where: any = {};

      if (search) {
        where.user = {
          name: {
            contains: search,
            mode: "insensitive",
          },
        };
      }

      if (status !== "all") {
        where.status = status as OrderStatus;
      }

      // Get total count for pagination
      const totalCount = await ctx.db.order.count({ where });

      // Get orders with related data
      const orders = await ctx.db.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: sortOrder,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          configuration: {
            select: {
              imageUrl: true,
              croppedImageUrl: true,
            },
          },
        },
      });

      return {
        orders,
        pagination: {
          total: totalCount,
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit),
        },
      };
    }),

  getRevenueMetrics: privateProcedure.query(async ({ ctx }) => {
    const now = new Date();

    // Start of week (Sunday)
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    // Start of month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Start of year
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // Get revenue for each period
    const [weekRevenue, monthRevenue, yearRevenue] = await Promise.all([
      ctx.db.order.aggregate({
        where: {
          createdAt: { gte: startOfWeek },
          isPaid: true,
        },
        _sum: {
          amount: true,
        },
      }),
      ctx.db.order.aggregate({
        where: {
          createdAt: { gte: startOfMonth },
          isPaid: true,
        },
        _sum: {
          amount: true,
        },
      }),
      ctx.db.order.aggregate({
        where: {
          createdAt: { gte: startOfYear },
          isPaid: true,
        },
        _sum: {
          amount: true,
        },
      }),
    ]);

    return {
      weekRevenue: weekRevenue._sum.amount || 0,
      monthRevenue: monthRevenue._sum.amount || 0,
      yearRevenue: yearRevenue._sum.amount || 0,
    };
  }),

  updateOrderStatus: privateProcedure
    .input(
      z.object({
        orderId: z.string(),
        status: z.enum(OrderStatus),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { orderId, status } = input;

      const updatedOrder = await ctx.db.order.update({
        where: { id: orderId },
        data: { status: status },
      });

      return updatedOrder;
    }),
});
