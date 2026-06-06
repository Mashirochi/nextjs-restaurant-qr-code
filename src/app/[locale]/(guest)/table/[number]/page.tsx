import GuestLoginForm from "@/feature/auth/guest.login.form";
import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "LoginGuest" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function TableNumberPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GuestLoginForm />
    </Suspense>
  );
}
