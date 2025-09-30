import MaxWidthWrapper from "@/components/max-width-wrapper";
import { ReactNode } from "react";
import Navbar from "./_components/navbar";

type Props = {
  children: ReactNode;
};

export default function FrontLayout({ children }: Props) {
  return (
    <div className="flex w-full justify-center px-4 sm:px-6 xl-px-0">
      <MaxWidthWrapper className="w-full relative min-h-screen border-x border-border">
        <Navbar />
        {children}
      </MaxWidthWrapper>
    </div>
  );
}
