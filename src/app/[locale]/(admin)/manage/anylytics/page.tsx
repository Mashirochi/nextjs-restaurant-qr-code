import { setRequestLocale } from "next-intl/server";

export default async function AnalyticsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  return <div>Analytics Page</div>;
}
