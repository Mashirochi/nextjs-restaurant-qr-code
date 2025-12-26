import { getTranslations } from "next-intl/server";
import SettingClient from "./setting-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Setting" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function SettingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Setting" });
  const tTabs = await getTranslations({ locale, namespace: "SettingTabs" });

  return (
    <SettingClient
      title={t("title")}
      profileTab={tTabs("profileTab")}
      passwordTab={tTabs("passwordTab")}
      paymentTab={tTabs("paymentTab")}
      paymentTabEmpty={tTabs("paymentTabEmpty")}
    />
  );
}
