import { getTranslations } from "next-intl/server";
import OrdersPageClient from "./orders-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Orders" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function OrdersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Orders" });
  const tOrderStatus = await getTranslations({
    locale,
    namespace: "OrderStatus",
  });

  const translatedStrings = {
    myOrdersTitle: t("myOrdersTitle"),
    loadingOrders: t("loadingOrders"),
    errorTitle: t("errorTitle"),
    errorLoadingOrders: t("errorLoadingOrders"),
    noOrders: t("noOrders"),
    noOrdersTitle: t("noOrdersTitle"),
    noOrdersMessage: t("noOrdersMessage"),
    totalPrice: t("totalPrice"),
    unitPrice: t("unitPrice"),
    unknownGuestName: t("unknownGuestName"),
    unknownTable: t("unknownTable"),
    pending: tOrderStatus("Pending"),
    processing: tOrderStatus("Processing"),
    rejected: tOrderStatus("Rejected"),
    delivered: tOrderStatus("Delivered"),
    paid: tOrderStatus("Paid"),
  };

  return <OrdersPageClient translations={translatedStrings} />;
}
