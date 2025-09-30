import { ReactNode } from "react";
import QueryProvider from "./query-provider";

type Props = {
  children: ReactNode;
};

export default function Providers({ children }: Props) {
  return (
    <>
      <QueryProvider>{children}</QueryProvider>
    </>
  );
}
