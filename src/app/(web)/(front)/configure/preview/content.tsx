"use client";

import ContentLoading from "@/components/content-loading";
import Phone from "@/components/phone";
import { Button } from "@/components/ui/button";
import { BASE_PRICE, COLORS, MODELS, PRODUCT_PRICES } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useClerk } from "@clerk/nextjs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowRight, Check, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import Confetti from "react-dom-confetti";
import { toast } from "sonner";

type Props = {
  configId: string;
};

export default function Content({ configId }: Props) {
  const router = useRouter();
  const clerk = useClerk();
  const [showConfetti, setShowConfetti] = useState(false);
  const [isRedirecting, startTransition] = useTransition();

  useEffect(() => setShowConfetti(true), []);

  const trpc = useTRPC();
  const config = useQuery(
    trpc.configuration.findById.queryOptions({ cid: configId })
  );

  const tw = COLORS.find((c) => c.value === config.data?.color)?.tw;
  const modelLabel = MODELS.options.find(
    (m) => m.value === config.data?.model
  )?.label;

  const calculateTotal = () => {
    let total = BASE_PRICE;
    if (config.data?.material === "polycarbonate")
      total += PRODUCT_PRICES.material.polycarbonate;
    if (config.data?.finish === "textured")
      total += PRODUCT_PRICES.finish.textured;
    return total;
  };

  const totalPrice = calculateTotal();

  const checkout = useMutation(
    trpc.payment.checkout.mutationOptions({
      onSuccess: ({ url }) => {
        if (!url) {
          toast.error("Failed to create secure payment session url");
          return;
        }

        startTransition(() => {
          router.push(url);
        });
      },
    })
  );

  const handleCheckout = () => {
    if (clerk.user) {
      checkout.mutate({ cid: configId });
    } else {
      clerk.openSignIn();
    }
  };

  if (config.isPending || config.isFetching) {
    return <ContentLoading />;
  }

  if (config.error) {
    if (config.error.data?.code === "NOT_FOUND") {
      router.push("/configure/upload");
    } else {
      toast.error("Oops! something went wrong 🙏");
    }

    return <ContentLoading />;
  }

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none select-none absolute inset-0 overflow-hidden flex justify-center"
      >
        <Confetti
          active={showConfetti}
          config={{ elementCount: 200, spread: 90 }}
        />
      </div>

      <div className="mt-20 flex flex-col items-center lg:grid lg:grid-cols-12 gap-9 lg:gap-12 text-sm">
        {/* Phone Image */}
        <div className="lg:col-span-3">
          <Phone className="w-60" img={config.data.croppedImageUrl!} bg={tw!} />
        </div>

        {/* Product Details */}
        <div className="lg:col-span-9 space-y-6">
          {/* Header */}
          <div>
            <h3 className="text-3xl font-bold tracking-tight text-gray-900">
              Your {modelLabel} Case
            </h3>
            <div className="mt-3 flex items-center gap-1.5 text-base">
              <Check className="h-4 w-4 text-green-500" />
              In stock and ready to ship
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 gap-6 border-b border-gray-200 py-8 text-base">
            <div>
              <p className="font-medium text-zinc-950">Highlights</p>
              <ul className="mt-3 text-zinc-700 list-disc list-inside">
                <li>Wireless charging compatible</li>
                <li>TPU shock absorption</li>
                <li>Packaging made from recycled materials</li>
                <li>5 year print warranty</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-zinc-950">Materials</p>
              <ul className="mt-3 text-zinc-700 list-disc list-inside">
                <li>High-quality, durable material</li>
                <li>Scratch- and fingerprint resistant coating</li>
              </ul>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-gray-50 p-6 sm:p-8 sm:rounded-xl">
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <p className="text-gray-600">Base price</p>
                <p className="font-medium text-gray-900">
                  {formatPrice(BASE_PRICE / 100)}
                </p>
              </div>

              {config.data.finish === "textured" && (
                <div className="flex items-center justify-between">
                  <p className="text-gray-600">Textured finish</p>
                  <p className="font-medium text-gray-900">
                    {formatPrice(PRODUCT_PRICES.finish.textured / 100)}
                  </p>
                </div>
              )}

              {config.data.material === "polycarbonate" && (
                <div className="flex items-center justify-between">
                  <p className="text-gray-600">Soft polycarbonate material</p>
                  <p className="font-medium text-gray-900">
                    {formatPrice(PRODUCT_PRICES.material.polycarbonate / 100)}
                  </p>
                </div>
              )}

              <div className="my-2 h-px bg-gray-200" />

              <div className="flex items-center justify-between py-2">
                <p className="font-semibold text-gray-900">Order total</p>
                <p className="font-semibold text-gray-900">
                  {formatPrice(totalPrice / 100)}
                </p>
              </div>
            </div>
          </div>

          {/* Checkout Button */}
          <div className="flex justify-end pb-12">
            <Button
              disabled={checkout.isPending || isRedirecting}
              onClick={handleCheckout}
              className="px-4 sm:px-6 lg:px-8"
            >
              {checkout.isPending ? (
                <>
                  Processing...
                  <Loader className="size-4 inline animate-spin" />
                </>
              ) : isRedirecting ? (
                <>
                  Redirecting...
                  <Loader className="size-4 inline animate-spin" />
                </>
              ) : (
                <>
                  Checkout
                  <ArrowRight className="h-4 w-4 ml-1.5 inline" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
