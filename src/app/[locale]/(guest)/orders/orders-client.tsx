"use client";

import { useGuestGetOrderList } from "@/lib/query/useOrder";
import { formatCurrency, getOrderStatusText, getGuestTableLoginPath } from "@/lib/utils";
import { OrderStatus } from "@/type/constant";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import envConfig from "@/lib/validateEnv";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  PayGuestOrdersResType,
  UpdateOrderResType,
} from "@/type/schema/order.schema";
import { toast } from "sonner";
import { useAppStore } from "@/lib/store/app.store";
import { Button } from "@/components/ui/button";
import { Star, MapPin } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";
import SwitchLanguage from "@/components/ui/switch-language";
import ModeToggle from "@/components/ui/mode-toggle";

type OrdersPageClientProps = {
  translations: {
    myOrdersTitle: string;
    loadingOrders: string;
    errorTitle: string;
    errorLoadingOrders: string;
    noOrders: string;
    noOrdersTitle: string;
    noOrdersMessage: string;
    totalPrice: string;
    unitPrice: string;
    unknownGuestName: string;
    unknownTable: string;
    pending: string;
    processing: string;
    rejected: string;
    delivered: string;
    paid: string;
  };
};

export default function OrdersPageClient({
  translations,
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
      default:
        return "secondary";
    }
  };

  console.log(translations);
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
      // Note: We need to handle dynamic order status translation differently
      // since we don't have the translation function passed anymore
      const statusText =
        status === "Pending"
          ? translations.pending
          : status === "Processing"
          ? translations.processing
          : status === "Rejected"
          ? translations.rejected
          : status === "Delivered"
          ? translations.delivered
          : status === "Paid"
          ? translations.paid
          : status;

      toast.success(
        `Đơn hàng "${dishSnapshot.name}" (x${quantity}) đã được cập nhật trạng thái: ${statusText}`
      );
      refetch();
    }

    function onPayment(data: PayGuestOrdersResType["data"]) {
      const { guest } = data[0];
      toast.success(
        `Khách hàng với tên "${
          guest?.name ?? translations.unknownGuestName
        }" tại bàn ${
          guest?.tableNumber ?? translations.unknownTable
        } đã thanh toán thành công.`
      );
      refetch();
    }

    function onGetOrderStatus(data: UpdateOrderResType["data"]) {
      const { dishSnapshot, quantity, status } = data;
      const statusText =
        status === "Pending"
          ? translations.pending
          : status === "Processing"
          ? translations.processing
          : status === "Rejected"
          ? translations.rejected
          : status === "Delivered"
          ? translations.delivered
          : status === "Paid"
          ? translations.paid
          : status;

      toast.info(
        `Trạng thái đơn "${dishSnapshot.name}" (x${quantity}): ${statusText}`
      );
      refetch();
    }

    socket?.on("connect", onConnect);
    socket?.on("update-order", onOrderUpdate);
    socket?.on("get-order-status", onGetOrderStatus);
    socket?.on("payment", onPayment);
    socket?.on("disconnect", onDisconnect);

    return () => {
      socket?.off("connect", onConnect);
      socket?.off("update-order", onOrderUpdate);
      socket?.off("get-order-status", onGetOrderStatus);
      socket?.off("payment", onPayment);
      socket?.off("disconnect", onDisconnect);
    };
  }, [refetch, translations]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {translations.myOrdersTitle}
          </h1>
          <p className="text-muted-foreground">{translations.loadingOrders}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, index) => (
            <Card key={index} className="flex flex-col relative overflow-hidden group border-border/40 bg-card/50 backdrop-blur-sm shadow-sm rounded-2xl p-4 gap-4">
              <div className="flex gap-4">
                <div className="h-20 w-20 rounded-xl bg-muted animate-pulse shrink-0" />
                <div className="flex flex-col flex-1 justify-between py-0.5">
                  <div className="flex justify-between items-start">
                    <div className="h-5 w-[120px] bg-muted animate-pulse rounded" />
                    <div className="h-5 w-8 bg-muted animate-pulse rounded ml-2" />
                  </div>
                  <div className="flex justify-between items-end mt-2">
                    <div className="flex flex-col gap-1">
                      <div className="h-3 w-12 bg-muted animate-pulse rounded" />
                      <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="h-3 w-16 bg-muted animate-pulse rounded" />
                      <div className="h-5 w-24 bg-muted animate-pulse rounded" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-10 w-full bg-muted animate-pulse rounded-lg mt-1" />
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
          <h1 className="text-3xl font-bold mb-2">
            {translations.myOrdersTitle}
          </h1>
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-md mx-auto">
            <h3 className="font-semibold text-lg mb-2 text-destructive">
              {translations.errorTitle}
            </h3>
            <p className="text-destructive/80">
              {(error as Error)?.message || translations.errorLoadingOrders}
            </p>
          </div>
        </div>
      </div>
    );
  }
const orders = data?.payload?.data || [];
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
      {/* Header */}
      <div className="p-4 bg-white dark:bg-slate-900 flex justify-between items-center shadow-sm dark:shadow-slate-900/50 z-10 sticky top-0 transition-colors duration-300">
        <div>
          <Link href={getGuestTableLoginPath()}>
            <h1 className="text-xl font-extrabold text-gray-800 dark:text-slate-100 uppercase tracking-tight hover:text-orange-500 transition-colors">
              Quán nhà mộc
            </h1>
          </Link>
          <div className="flex items-center text-xs text-gray-500 dark:text-slate-400 mt-1 max-w-[250px]">
            <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
            <span className="truncate">
              26H1 Ngõ 130 Xuân Thuỷ Cầu Giấy, Phường...
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <SwitchLanguage compact className="h-10 rounded-full bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-inner px-3 text-slate-800 dark:text-slate-200 w-[70px] focus:ring-0 focus:ring-offset-0" />
          <ModeToggle />
        </div>
      </div>

      <div className="container mx-auto py-8 flex-1 p-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {translations.myOrdersTitle}
          </h1>
          <p className="text-muted-foreground">
            {orders.length > 0 ? "" : translations.noOrders}
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
            <h3 className="text-xl font-semibold mb-2">
              {translations.noOrdersTitle}
            </h3>
            <p className="text-muted-foreground mb-4">
              {translations.noOrdersMessage}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {orders.map((order) => (
              <Card key={order.id} className="flex flex-col relative overflow-hidden group border-border/40 bg-card/50 backdrop-blur-sm shadow-sm rounded-2xl">
                <div className="flex p-4 gap-4">
                  <div className="relative h-20 w-20 rounded-xl overflow-hidden shadow-sm shrink-0 bg-muted">
                    <Image
                      src={`${envConfig.NEXT_PUBLIC_API_ENDPOINT}/static/dishes/${order.dishSnapshot.image}`}
                      alt={order.dishSnapshot.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  
                  <div className="flex flex-col flex-1 justify-between py-0.5">
                     <div className="flex justify-between items-start">
                       <h3 className="font-bold text-base leading-tight line-clamp-2 text-card-foreground pr-2">
                         {order.dishSnapshot.name}
                       </h3>
                       <div className="bg-primary text-primary-foreground px-2 py-0.5 rounded-md text-xs font-bold shrink-0 shadow-sm">
                         x{order.quantity}
                       </div>
                     </div>
                     
                     <div className="flex justify-between items-end mt-2">
                       <div className="flex flex-col">
                          <span className="text-[10px] sm:text-xs text-muted-foreground mb-0.5">{translations.unitPrice}</span>
                          <span className="text-xs sm:text-sm font-medium">{formatCurrency(order.dishSnapshot.basePrice)}</span>
                       </div>
                       <div className="flex flex-col items-end">
                          <span className="text-[10px] sm:text-xs text-muted-foreground mb-0.5">{translations.totalPrice}</span>
                          <div className="flex items-center gap-1.5">
                            {order?.dishSnapshot?.virtualPrice && (
                              <span className="text-[10px] sm:text-xs text-muted-foreground line-through">
                                {formatCurrency(Number(order.dishSnapshot.virtualPrice) * order.quantity)}
                              </span>
                            )}
                            <span className="text-sm sm:text-base font-black text-orange-500 dark:text-orange-400">
                               {formatCurrency(order.dishSnapshot.basePrice * order.quantity)}
                            </span>
                          </div>
                       </div>
                     </div>
                  </div>
                </div>
                
                <div className="px-4 pb-4">
                  <Badge
                    variant={getOrderStatusVariant(order.status) as any}
                    className="w-full justify-center py-2.5 text-xs font-semibold uppercase tracking-wider rounded-lg shadow-sm"
                  >
                    {order.status === "Pending"
                      ? translations.pending
                      : order.status === "Processing"
                      ? translations.processing
                      : order.status === "Rejected"
                      ? translations.rejected
                      : order.status === "Delivered"
                      ? translations.delivered
                      : order.status === "Paid"
                      ? translations.paid
                      : order.status}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
