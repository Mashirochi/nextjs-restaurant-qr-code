"use client";

import { useGuestGetOrderList } from "@/lib/query/useOrder";
import { formatCurrency, getOrderStatusText } from "@/lib/utils";
import { OrderStatus } from "@/type/constant";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import envConfig from "@/lib/validateEnv";
import { useEffect, useState } from "react";
import {
  PayGuestOrdersResType,
  UpdateOrderResType,
} from "@/type/schema/order.schema";
import { toast } from "sonner";
import { useAppStore } from "@/lib/store/app.store";
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

  return (
    <OrdersPageClient t={t} tCommon={tCommon} tOrderStatus={tOrderStatus} />
  );
}
