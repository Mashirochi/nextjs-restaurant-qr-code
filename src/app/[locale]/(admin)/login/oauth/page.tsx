import { Suspense } from "react";
import OauthContentClient from "./oauth-content";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Oauth" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function OauthPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Oauth" });
  const loginFailed = await getTranslations({ locale, namespace: "Common" });

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OauthContentClient loginFailedText={loginFailed("loginFailed")} />
    </Suspense>
  );
}
