import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function AuthLayout({ children }: Props) {
  return (
    <div className="min-h-[calc(100vh-0.1rem)] relative">
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

      <div className="size-full flex justify-center items-center bg-brand-desert-50">
        {children}
      </div>
    </div>
  );
}
