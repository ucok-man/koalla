import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-[calc(100vh-0.1rem)] flex items-center justify-center flex-col">
      <SignUp />
    </div>
  );
}
