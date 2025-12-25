import { Suspense } from "react";
import OauthContent from "./oauth-content";
import { setRequestLocale } from "next-intl/server";

export default async function OauthPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OauthContent />
    </Suspense>
  );
}
