import { TRPCReactProvider } from "@/trpc/client";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function Providers({ children }: Props) {
  return (
    <>
      <TRPCReactProvider>{children}</TRPCReactProvider>
    </>
  );
}
