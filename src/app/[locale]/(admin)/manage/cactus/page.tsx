import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Cactus" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function CactusPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Cactus" });

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground mt-2">{t("description")}</p>
      </div>

      <div className="bg-card p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">{t("sectionTitle")}</h2>
        <p>{t("content")}</p>
      </div>
    </div>
  );
}
