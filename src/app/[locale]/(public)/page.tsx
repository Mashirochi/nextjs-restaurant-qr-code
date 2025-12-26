import Home from "@/feature/homepage";
import dishRequest from "@/lib/api/dish.request";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "HomePage" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function HomePage() {
  const res = await dishRequest.list({ page: 1, take: 500 });
  return (
    <div className="flex flex-wrap items-center gap-2 md:flex-row">
      <Home dishList={res?.payload?.data ?? []} />
    </div>
  );
}
