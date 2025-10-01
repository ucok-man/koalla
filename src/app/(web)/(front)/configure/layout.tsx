import { ReactNode } from "react";
import Steps from "./_components/steps";

type Props = {
  children: ReactNode;
};

export default function ConfigureLayout({ children }: Props) {
  return (
    <div className="space-y-16">
      <Steps />
      {children}
    </div>
  );
}
