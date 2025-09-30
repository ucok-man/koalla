import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  img: string;
}

export default function Phone({ img, className, ...props }: Props) {
  return (
    <div
      className={cn(
        "relative pointer-events-none z-10 overflow-hidden",
        className
      )}
      {...props}
    >
      <img
        src={"/phone-template.png"}
        className="pointer-events-none select-none"
        alt="phone image"
      />

      <div className="absolute -z-10 inset-0 inset-x-1 rounded-[2.25rem] overflow-hidden">
        <img
          className="object-cover min-w-full min-h-full"
          src={img}
          alt="phone content"
        />
      </div>
    </div>
  );
}
