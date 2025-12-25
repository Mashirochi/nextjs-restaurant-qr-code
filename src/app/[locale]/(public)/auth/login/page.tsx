import LoginForm from "@/feature/auth/login.form";
import { setRequestLocale } from "next-intl/server";

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
