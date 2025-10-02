"use client";

import { formatPrice } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import ContentLoading from "../_components/content-loading";
import PhoneWithHand from "../_components/phone-with-hand";

type Props = {
  orderId: string;
};

export default function Content({ orderId }: Props) {
  const trpc = useTRPC();

  const { data } = useQuery(
    trpc.order.getById.queryOptions(
      { oid: orderId },
      {
        refetchInterval: (query) => {
          if (query.state.data?.isPaid) {
            return false;
          }
          return 3000;
        },
      }
    )
  );

  if (data === undefined) {
    return <ContentLoading text="Getting your order..." />;
  }

  if (data.isPaid === false) {
    return <ContentLoading text="Verifying your payment..." />;
  }

  const { configuration, shippingAddress, amount } = data;
  const { color } = configuration;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 bg-secondary sm:px-12 rounded-lg">
      <div className="max-w-xl">
        <p className="text-base font-medium">Thank you!</p>
        <h1 className="mt-2 text-4xl relative -left-[1px] font-bold tracking-tight sm:text-5xl">
          Your case is on the way!
        </h1>
        <p className="mt-2 text-base text-brand-primary-500">
          We've received your order and are now processing it.
        </p>

        <div className="mt-12 text-sm font-medium">
          <p className="text-brand-primary">Order number</p>
          <p className="mt-2 text-brand-primary-500">{orderId}</p>
        </div>
      </div>

      <div className="mt-10 border-t border-border">
        <div className="mt-10 flex flex-auto flex-col">
          <h4 className="font-semibold">You made a great choice!</h4>
          <p className="mt-2 text-sm text-brand-primary-600 leading-relaxed">
            We at CaseCobra believe that a phone case doesn't only need to look
            good, but also last you for the years to come. We offer a 5-year
            print guarantee: If you case isn't of the highest quality, we'll
            replace it for free.
          </p>
        </div>
      </div>

      <div className="flex space-x-6 overflow-hidden mt-4 rounded-xl bg-gray-900/5 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl">
        <PhoneWithHand
          croppedImageUrl={configuration.croppedImageUrl!}
          color={color!}
        />
      </div>

      <div>
        <div className="text-sm py-10">
          <p className="font-medium ">Shipping address</p>
          <div className="mt-2 text-brand-primary-600">
            <address className="not-italic leading-relaxed">
              <span className="block">{shippingAddress?.name}</span>
              <span className="block">{shippingAddress?.street}</span>
              <span className="block">
                {shippingAddress?.postalCode} {shippingAddress?.city}
              </span>
            </address>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-6 border-t border-border py-10 text-sm">
          <div>
            <p className="font-medium">Payment status</p>
            <p className="mt-2 text-brand-primary-600">Paid</p>
          </div>

          <div>
            <p className="font-medium">Shipping Method</p>
            <p className="mt-2 text-brand-primary-600">
              DHL, takes up to 3 working days
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6 border-t border-border pt-10 text-sm">
        <div className="flex justify-between">
          <p className="font-medium">Subtotal</p>
          <p className="text-brand-primary-600">{formatPrice(amount)}</p>
        </div>
        <div className="flex justify-between">
          <p className="font-medium">Shipping</p>
          <p className="text-brand-primary-600">{formatPrice(0)}</p>
        </div>
        <div className="flex justify-between">
          <p className="font-medium">Total</p>
          <p className="text-brand-primary-900 font-medium">
            {formatPrice(amount)}
          </p>
        </div>
      </div>
    </div>
  );
}
