"use client";

import ThreeDotLoader from "@/components/three-dot-loader";
import { useTRPC } from "@/trpc/client";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function SyncUserPage() {
  const router = useRouter();
  const { isLoaded, user } = useUser();
  const trpc = useTRPC();

  const syncUser = useMutation(
    trpc.user.sync.mutationOptions({
      onSuccess: () => {
        router.push("/");
      },
    })
  );

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (isLoaded && !user) {
      router.push("/sign-in");
      return;
    }

    const email = user.emailAddresses.at(0)?.emailAddress;
    if (!email) {
      console.error("Clerk user does not have email address attached");
      toast.error("Oops! something went wrong 🙏");
      return;
    }

    syncUser.mutate({
      id: user.id,
      email: email,
      name: user.fullName ?? "",
      image: user.imageUrl,
    });
  }, [router, isLoaded, user]);

  return (
    <div className="space-y-3 text-center min-h-[calc(100vh-0.1rem)] flex items-center justify-center flex-col">
      <div className="flex items-center gap-3 relative top-10">
        <Image
          src="/brand-logo-sleep.png"
          alt="Stuck Overflow"
          width={100}
          height={100}
          className="relative -top-6"
        />
        <h1 className="text-4xl font-medium tracking-wide font-mono animate-pulse">
          Koalla
        </h1>
      </div>

      <ThreeDotLoader size="lg" />

      <p className="text-muted-foreground text-base">
        Preparing your account...
      </p>
    </div>
  );
}
