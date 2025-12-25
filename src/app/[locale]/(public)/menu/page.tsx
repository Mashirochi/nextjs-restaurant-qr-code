import MenuClient from "@/feature/menu.client";
import dishRequest from "@/lib/api/dish.request";
import { DishStatus } from "@/type/constant";
import { setRequestLocale } from "next-intl/server";

export default async function MenuPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  const res = await dishRequest.list({
    page: 1,
    take: 500,
    filter: { status: DishStatus.Available },
  });

  const dishes = res?.payload?.data ?? [];

  return <MenuClient dishes={dishes} />;
}
