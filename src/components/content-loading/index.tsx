"use client";

import ThreeDotLoader from "@/components/three-dot-loader";
import { cn } from "@/lib/utils";
import Image from "next/image";

type Props = {
  text?: string;
  classname?: string;
};

export default function ContentLoading({
  text = "Preparing your resources...",
  classname,
}: Props) {
  return (
    <div
      className={cn(
        "space-y-3 text-center h-full py-24 flex items-center justify-center flex-col",
        classname
      )}
    >
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

      <p className="text-muted-foreground text-base">{text}</p>
    </div>
  );
}
