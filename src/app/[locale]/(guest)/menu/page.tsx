import MenuClient from "@/feature/menu.client";
import dishRequest from "@/lib/api/dish.request";
import { DishStatus } from "@/type/constant";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import envConfig from "@/lib/validateEnv";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "GuestMenu" });
  const url = envConfig.NEXT_PUBLIC_URL + `/${locale}/menu`;

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: url,
    },
  };
}

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
