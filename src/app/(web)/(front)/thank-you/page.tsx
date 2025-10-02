import { redirect } from "next/navigation";
import Content from "./content";

type Props = {
  searchParams: Promise<{ orderId?: string }>;
};

export default async function ThankYouPage({ searchParams }: Props) {
  const orderId = (await searchParams).orderId;
  if (!orderId) redirect("/configure/upload");

  return <Content orderId={orderId} />;
}
