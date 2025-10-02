"use client";

import ThreeDotLoader from "@/components/three-dot-loader";
import Image from "next/image";

export default function ContentLoading() {
  return (
    <div className="space-y-3 text-center h-full py-24 flex items-center justify-center flex-col">
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
        Preparing your resources...
      </p>
    </div>
  );
}
