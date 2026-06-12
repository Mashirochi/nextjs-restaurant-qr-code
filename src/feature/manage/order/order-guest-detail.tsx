import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePayBillMutation } from "@/lib/query/useBill";
import { PaymentMethod } from "@/type/schema/bill.schema";
import {
  OrderStatusIcon,
  formatCurrency,
  formatDateTimeToLocaleString,
  formatDateTimeToTimeString,
  getVietnameseOrderStatus,
  handleErrorApi,
} from "@/lib/utils";
import envConfig from "@/lib/validateEnv";
import { OrderStatus } from "@/type/constant";
import { GetOrdersResType } from "@/type/schema/order.schema";
import { CloseBillResType } from "@/type/schema/bill.schema";
import Image from "next/image";
import { Fragment } from "react";
import { toast } from "sonner";

type Guest = GetOrdersResType["data"][0]["guest"];
type Orders = GetOrdersResType["data"];
export default function OrderGuestDetail({
  guest,
  orders,
  onPaySuccess,
}: {
  guest: Guest;
  orders: Orders;
  onPaySuccess?: () => void;
}) {
  const ordersFilterToPurchase = guest
    ? orders.filter(
        (order) =>
          order.status !== OrderStatus.Paid &&
          order.status !== OrderStatus.Rejected
      )
    : [];
  const purchasedOrderFilter = guest
    ? orders.filter((order) => order.status === OrderStatus.Paid)
    : [];
  const payBillMutation = usePayBillMutation();

  const pay = async () => {
    if (payBillMutation.isPending || !guest || orders.length === 0) return;
    const billId = orders[0].billId;
    if (!billId) {
      toast.error("Không tìm thấy hóa đơn");
      return;
    }
    try {
      const res = await payBillMutation.mutateAsync({
        id: billId,
        body: { method: PaymentMethod.Cash }
      });
      onPaySuccess && onPaySuccess();
    } catch (error) {
      handleErrorApi({ error });
      console.error("Error paying for guest orders:", error);
    }
  };
  return (
    <div className="space-y-2 text-sm">
      {guest && (
        <Fragment>
          <div className="space-x-1">
            <span className="font-semibold">Tên:</span>
            <span>{guest.name}</span>
            <span className="font-semibold">(#{guest.id})</span>
            <span>|</span>
            <span className="font-semibold">Bàn:</span>
            <span>{guest.tableNumber}</span>
          </div>
          <div className="space-x-1">
            <span className="font-semibold">Ngày đăng ký:</span>
            <span>{formatDateTimeToLocaleString(guest.createdAt)}</span>
          </div>
        </Fragment>
      )}

      <div className="space-y-1">
        <div className="font-semibold">Đơn hàng:</div>
        {orders.map((order, index) => {
          return (
            <div key={order.id} className="flex gap-2 items-center text-xs">
              <span className="w-[10px]">{index + 1}</span>
              <span title={getVietnameseOrderStatus(order.status)}>
                {order.status === OrderStatus.Pending && (
                  <OrderStatusIcon.Pending className="w-4 h-4" />
                )}
                {order.status === OrderStatus.Processing && (
                  <OrderStatusIcon.Processing className="w-4 h-4" />
                )}
                {order.status === OrderStatus.Rejected && (
                  <OrderStatusIcon.Rejected className="w-4 h-4 text-red-400" />
                )}
                {order.status === OrderStatus.Delivered && (
                  <OrderStatusIcon.Delivered className="w-4 h-4" />
                )}
                {order.status === OrderStatus.Paid && (
                  <OrderStatusIcon.Paid className="w-4 h-4 text-yellow-400" />
                )}
              </span>
              <Image
                src={`${envConfig.NEXT_PUBLIC_API_ENDPOINT}/static/dishes/${order.dishSnapshot.image}`}
                alt={order.dishSnapshot.name}
                title={order.dishSnapshot.name}
                width={30}
                height={30}
                className="h-[30px] w-[30px] rounded object-cover"
              />
              <span
                className="truncate w-[70px] sm:w-[100px]"
                title={order.dishSnapshot.name}
              >
                {order.dishSnapshot.name}
              </span>
              <span className="font-semibold" title={`Tổng: ${order.quantity}`}>
                x{order.quantity}
              </span>
              <span className="italic">
                {formatCurrency(order.quantity * order.dishSnapshot.basePrice)}
              </span>
              <span
                className="hidden sm:inline"
                title={`Tạo: ${formatDateTimeToLocaleString(
                  order.createdAt
                )} | Cập nhật: ${formatDateTimeToLocaleString(order.updatedAt)}
          `}
              >
                {formatDateTimeToLocaleString(order.createdAt)}
              </span>
              <span
                className="sm:hidden"
                title={`Tạo: ${formatDateTimeToLocaleString(
                  order.createdAt
                )} | Cập nhật: ${formatDateTimeToLocaleString(order.updatedAt)}
          `}
              >
                {formatDateTimeToTimeString(order.createdAt)}
              </span>
            </div>
          );
        })}
      </div>

      <div className="space-x-1">
        <span className="font-semibold">Chưa thanh toán:</span>
        <Badge>
          <span>
            {formatCurrency(
              ordersFilterToPurchase.reduce((acc, order) => {
                return acc + order.quantity * order.dishSnapshot.basePrice;
              }, 0)
            )}
          </span>
        </Badge>
      </div>
      <div className="space-x-1">
        <span className="font-semibold">Đã thanh toán:</span>
        <Badge variant={"outline"}>
          <span>
            {formatCurrency(
              purchasedOrderFilter.reduce((acc, order) => {
                return acc + order.quantity * order.dishSnapshot.basePrice;
              }, 0)
            )}
          </span>
        </Badge>
      </div>

      <div>
        <Button
          className="w-full"
          size={"sm"}
          variant={"secondary"}
          disabled={ordersFilterToPurchase.length === 0}
          onClick={pay}
        >
          Thanh toán tất cả ({ordersFilterToPurchase.length} đơn)
        </Button>
      </div>
    </div>
  );
}
