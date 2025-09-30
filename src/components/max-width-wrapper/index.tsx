import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type Props = {
  className?: string;
  children: ReactNode;
};

export default function MaxWidthWrapper({ className, children }: Props) {
  return (
    <div className={cn("h-full mx-auto w-full max-w-screen-xl", className)}>
      {children}
    </div>
  );
}
