import { ReactNode } from "react";
import Steps from "./_components/steps";

type Props = {
  children: ReactNode;
};

export default function ConfigureLayout({ children }: Props) {
  return (
    <div>
      <Steps />
      {children}
    </div>
  );
}
