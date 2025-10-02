import MaxWidthWrapper from "@/components/max-width-wrapper";
import Navbar from "@/components/navbar";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  return (
    <div className="relative">
      <div className="fixed transform left-1/2 -translate-x-1/2 top-1/6 -translate-y-1/2 pointer-events-none w-full z-0">
        <img
          src="/mask-group-pattern.svg"
          alt=""
          className="w-[936px] sm:w-[1404px] md:w-[2106px] lg:w-[2808px] h-auto opacity-30 sm:opacity-40 md:opacity-40 mix-blend-multiply"
          style={{
            filter: "hue-rotate(15deg) saturate(0.7) brightness(1.2)",
          }}
        />
      </div>

      <div className="flex w-full justify-center">
        <MaxWidthWrapper className="w-full relative min-h-screen border-x border-border">
          <Navbar />
          <main className="px-4 py-8">{children}</main>
        </MaxWidthWrapper>
      </div>
    </div>
  );
}
