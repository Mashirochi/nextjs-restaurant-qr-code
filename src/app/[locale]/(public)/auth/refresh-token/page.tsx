import RefreshToken from "@/feature/auth/refresh.token";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "RefreshToken" });

  return {
    title: t("title"),
    description: t("description"),
    robots: {
      index: false,
    },
  };
}

export default async function RefreshTokenPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RefreshToken />
    </Suspense>
  );
}
