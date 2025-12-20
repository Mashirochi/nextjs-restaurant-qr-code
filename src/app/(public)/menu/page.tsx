import MenuClient from "@/feature/menu.client";
import dishRequest from "@/lib/api/dish.request";
import { DishStatus } from "@/type/constant";

export default async function MenuPage() {
  const res = await dishRequest.list({
    page: 1,
    take: 500,
    filter: { status: DishStatus.Available },
  });

  const dishes = res?.payload?.data ?? [];

  return <MenuClient dishes={dishes} />;
}
