import ContentLoading from "@/components/content-loading";
import { Suspense } from "react";
import Content from "./content";

export default function DashboardPage() {
  return (
    <Suspense
      fallback={<ContentLoading classname="min-h-[calc(100vh-16rem)]" />}
    >
      <Content />
    </Suspense>
  );
}
