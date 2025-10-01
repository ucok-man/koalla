import { ReactNode } from "react";
import Steps from "./_components/steps";

type Props = {
  children: ReactNode;
};

export default function ConfigureLayout({ children }: Props) {
  return (
    <div className="px-4 py-8">
      <Steps />
      {children}
    </div>
  );
}
