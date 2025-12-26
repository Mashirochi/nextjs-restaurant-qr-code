import LoginForm from "@/feature/auth/login.form";
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
  const t = await getTranslations({ locale, namespace: "Login" });
  const url = envConfig.NEXT_PUBLIC_URL + `/${locale}/auth/login`;

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: url,
    },
  };
}

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  return <LoginForm />;
}
