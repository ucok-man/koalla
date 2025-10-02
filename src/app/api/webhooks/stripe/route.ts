// import OrderReceivedEmail from "@/components/emails/OrderReceivedEmail";
// import { Resend } from "resend";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

// const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = (await headers()).get("stripe-signature");

    if (!signature) {
      return new Response("Invalid signature", { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET ?? ""
    );

    if (event.type === "checkout.session.completed") {
      if (!event.data.object.customer_details?.email) {
        throw new Error("Missing user email");
      }

      const session = event.data.object as Stripe.Checkout.Session;
      const { userId, orderId } = session.metadata || {
        userId: null,
        orderId: null,
      };

      if (!userId || !orderId) {
        throw new Error("Invalid request metadata");
      }

      const shipping = session.customer_details?.address;

      console.log(session);

      const order = await db.order.update({
        where: {
          id: orderId,
        },
        data: {
          isPaid: true,
          shippingAddress: {
            create: {
              name: session.customer_details?.name ?? "",
              city: shipping?.city ?? "",
              country: shipping?.country ?? "",
              postalCode: shipping?.postal_code ?? "",
              street: shipping?.line1 ?? "",
              state: shipping?.state ?? "",
              phoneNumber: session.customer_details?.phone,
            },
          },
        },
      });

      //   await resend.emails.send({
      //     from: "CaseCobra <hello@joshtriedcoding.com>",
      //     to: [event.data.object.customer_details.email],
      //     subject: "Thanks for your order!",
      //     react: OrderReceivedEmail({
      //       orderId,
      //       orderDate: updatedOrder.createdAt.toLocaleDateString(),
      //     //   @ts-ignore
      //       shippingAddress: {
      //         name: session.customer_details!.name!,
      //         city: shippingAddress!.city!,
      //         country: shippingAddress!.country!,
      //         postalCode: shippingAddress!.postal_code!,
      //         street: shippingAddress!.line1!,
      //         state: shippingAddress!.state,
      //       },
      //     }),
      //   });
    }

    return NextResponse.json({ result: event, ok: true });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { message: "Something went wrong", ok: false },
      { status: 500 }
    );
  }
}
