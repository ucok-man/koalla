import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-[calc(100vh-0.1rem)] flex items-center justify-center flex-col">
      <SignIn />
    </div>
  );
}
