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
  const tCommon = await getTranslations({ locale, namespace: "Common" });
  const tOrderStatus = await getTranslations({
    locale,
    namespace: "OrderStatus",
  });

  // Get all the translated strings on the server side
  const translatedStrings = {
    myOrdersTitle: t("myOrdersTitle"),
    loadingOrders: t("loadingOrders"),
    errorTitle: t("errorTitle"),
    errorLoadingOrders: t("errorLoadingOrders"),
    noOrders: t("noOrders"),
    noOrdersTitle: t("noOrdersTitle"),
    noOrdersMessage: t("noOrdersMessage"),
    quantityTemplate: t("quantity", { count: 1 }), // Template with a sample value
    totalPrice: t("totalPrice"),
    unitPrice: t("unitPrice"),
    unknownGuestName: t("unknownGuestName"),
    unknownTable: t("unknownTable"),
    orderTimeTemplate: t("orderTime", { time: "TIME_PLACEHOLDER" }), // Template with placeholder
    orderCodeTemplate: t("orderCode", { id: 1 }), // Template with a sample value
    orderCountTemplate: t("orderCount", { count: 1 }), // Template with a sample value
    // Order status translations
    pending: tOrderStatus("Pending"),
    processing: tOrderStatus("Processing"),
    rejected: tOrderStatus("Rejected"),
    delivered: tOrderStatus("Delivered"),
    paid: tOrderStatus("Paid"),
  };

  return <OrdersPageClient translations={translatedStrings} />;
}
