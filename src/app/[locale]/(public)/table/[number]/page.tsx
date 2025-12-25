import GuestLoginForm from "@/feature/auth/guest.login.form";
import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";

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
      <TableContent />
    </Suspense>
  );
}

function TableContent() {
  return <GuestLoginForm />;
}
