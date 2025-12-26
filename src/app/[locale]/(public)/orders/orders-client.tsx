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
type OrdersPageClientProps = {
  t: (key: string, values?: Record<string, any>) => string;
  tCommon: (key: string, values?: Record<string, any>) => string;
  tOrderStatus: (key: string, values?: Record<string, any>) => string;
};

export default function OrdersPageClient({
  t,
  tCommon,
  tOrderStatus,
}: OrdersPageClientProps) {
  const { data, isLoading, isError, error, refetch } = useGuestGetOrderList();

  const getOrderStatusVariant = (status: string) => {
    switch (status) {
      case OrderStatus.Pending:
        return "secondary";
      case OrderStatus.Processing:
        return "secondary";
      case OrderStatus.Rejected:
        return "destructive";
      case OrderStatus.Delivered:
        return "default";
      case OrderStatus.Paid:
        return "default";
      default:
        return "secondary";
    }
  };

  const socket = useAppStore((state) => state.socket);

  useEffect(() => {
    if (socket?.connected) {
      onConnect();
    }

    function onConnect() {
      console.log(socket?.id);
    }

    function onDisconnect() {}

    function onOrderUpdate(data: UpdateOrderResType["data"]) {
      const { dishSnapshot, quantity, status } = data;
      toast.success(
        `${t("orderUpdatedToast", {
          dishName: dishSnapshot.name,
          quantity,
          status: tOrderStatus(status),
        })}`
      );
      refetch();
    }

    function onPayment(data: PayGuestOrdersResType["data"]) {
      const { guest } = data[0];
      toast.success(
        `${t("paymentSuccessToast", {
          guestName: guest?.name ?? t("unknownGuestName"),
          tableNumber: guest?.tableNumber ?? t("unknownTable"),
        })}`
      );
      refetch();
    }

    socket?.on("connect", onConnect);
    socket?.on("update-order", onOrderUpdate);
    socket?.on("payment", onPayment);
    socket?.on("disconnect", onDisconnect);

    return () => {
      socket?.off("connect", onConnect);
      socket?.off("update-order", onOrderUpdate);
      socket?.off("payment", onPayment);
      socket?.off("disconnect", onDisconnect);
    };
  }, [refetch, t, tOrderStatus]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{t("myOrdersTitle")}</h1>
          <p className="text-muted-foreground">{t("loadingOrders")}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, index) => (
            <Card key={index} className="flex flex-col">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-muted animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-[200px] bg-muted animate-pulse" />
                  <div className="h-4 w-[150px] bg-muted animate-pulse" />
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="h-4 w-[100px] mb-2 bg-muted animate-pulse" />
                <div className="h-4 w-[150px] mb-4 bg-muted animate-pulse" />
                <div className="h-8 w-full bg-muted animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">{t("myOrdersTitle")}</h1>
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-md mx-auto">
            <h3 className="font-semibold text-lg mb-2 text-destructive">
              {t("errorTitle")}
            </h3>
            <p className="text-destructive/80">
              {(error as Error)?.message || t("errorLoadingOrders")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const orders = data?.payload?.data || [];

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">{t("myOrdersTitle")}</h1>
        <p className="text-muted-foreground">
          {orders.length > 0
            ? t("orderCount", { count: orders.length })
            : t("noOrders")}
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">{t("noOrdersTitle")}</h3>
          <p className="text-muted-foreground mb-4">{t("noOrdersMessage")}</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <Card key={order.id} className="flex flex-col">
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={`${envConfig.NEXT_PUBLIC_API_ENDPOINT}/static/dishes/${order.dishSnapshot.image}`}
                    alt={order.dishSnapshot.name}
                  />
                  <AvatarFallback className="bg-muted">
                    {order.dishSnapshot.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">
                    {order.dishSnapshot.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {t("quantity", { count: order.quantity })}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{t("totalPrice")}:</span>

                  <div className="flex items-center gap-2">
                    {order?.dishSnapshot?.virtualPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        {formatCurrency(
                          Number(order.dishSnapshot.virtualPrice)
                        )}
                      </span>
                    )}

                    <span className="font-bold">
                      {formatCurrency(
                        order.dishSnapshot.basePrice * order.quantity
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <span className="font-medium">{t("unitPrice")}:</span>

                  <div className="flex items-center gap-1">
                    <span>{formatCurrency(order.dishSnapshot.basePrice)}</span>
                  </div>
                </div>

                <Badge
                  variant={getOrderStatusVariant(order.status) as any}
                  className="w-full justify-center py-2 text-sm"
                >
                  {tOrderStatus(order.status)}
                </Badge>
                <div className="mt-4 text-xs text-muted-foreground">
                  <p>
                    {t("orderTime", {
                      time: new Date(order.createdAt).toLocaleString("vi-VN"),
                    })}
                  </p>
                  <p>{t("orderCode", { id: order.id })}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
