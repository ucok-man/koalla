import { redirect } from "next/navigation";
import Content from "./content";

type Props = {
  searchParams: Promise<{ configId?: string }>;
};

export default async function PreviewPage({ searchParams }: Props) {
  const configId = (await searchParams).configId;
  if (!configId) redirect("/configure/upload");

  return <Content configId={configId} />;
}
