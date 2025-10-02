import { BASE_PRICE, PRODUCT_PRICES } from "@/lib/products";
import { stripe } from "@/lib/stripe";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { createTRPCRouter, privateProcedure } from "../init";

export const paymentRouter = createTRPCRouter({
  checkout: privateProcedure
    .input(
      z.object({
        cid: z.string().trim().min(1, "config id is required"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const { cid } = input;
        const { user, db } = ctx;

        const configuration = await db.configuration.findUnique({
          where: { id: cid },
        });

        if (!configuration) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "No such configuration found",
          });
        }

        const { finish, material } = configuration;

        let price = BASE_PRICE;
        if (finish === "textured") price += PRODUCT_PRICES.finish.textured;
        if (material === "polycarbonate")
          price += PRODUCT_PRICES.material.polycarbonate;

        let order = await db.order.findFirst({
          where: {
            userId: user.id,
            configurationId: configuration.id,
          },
        });

        if (!order) {
          order = await db.order.create({
            data: {
              amount: price / 100,
              userId: user.id,
              configurationId: configuration.id,
            },
          });
        }

        const product = await stripe.products.create({
          name: "Custom iPhone Case",
          images: [configuration.imageUrl],
          default_price_data: {
            currency: "USD",
            unit_amount: price,
          },
        });

        const stripeSession = await stripe.checkout.sessions.create({
          success_url: `${process.env.NEXT_PUBLIC_APP_URL}/thank-you?orderId=${order.id}`,
          cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/configure/preview?configId=${configuration.id}`,
          mode: "payment",
          shipping_address_collection: { allowed_countries: ["ID", "US"] },
          metadata: {
            userId: user.id,
            orderId: order.id,
          },
          line_items: [{ price: product.default_price as string, quantity: 1 }],
        });

        return { url: stripeSession.url };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create stripe checkout session",
          cause: error,
        });
      }
    }),
});
