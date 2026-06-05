"use client";

import React, { useState, useMemo, useCallback, useRef } from "react";
import { useGetBillList, useUpdateOrderMutation } from "@/lib/query/useOrder";
import { GetOrdersResType } from "@/type/schema/order.schema";
import { OrderStatus } from "@/type/constant";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency, handleErrorApi } from "@/lib/utils";
import {
  Banknote,
  CreditCard,
  Printer,
  Receipt,
  RefreshCcw,
  X,
  RotateCcw,
} from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { generateBillHtml } from "@/components/bill/generate-bill-html";

type OrderItem = GetOrdersResType["data"][0];

interface Bill {
  guestId: number;
  guestName: string;
  tableNumber: number | null;
  orders: OrderItem[];
  totalAmount: number;
  totalItems: number;
}

function groupOrdersIntoBills(orders: OrderItem[]): Bill[] {
  const billMap = new Map<number, Bill>();
  for (const order of orders) {
    if (!order.guestId) continue;
    if (!billMap.has(order.guestId)) {
      billMap.set(order.guestId, {
        guestId: order.guestId,
        guestName: order.guest?.name ?? "Không xác định",
        tableNumber: order.tableNumber,
        orders: [],
        totalAmount: 0,
        totalItems: 0,
      });
    }
    const bill = billMap.get(order.guestId)!;
    bill.orders.push(order);
    bill.totalItems += order.quantity;
    if (
      order.status === OrderStatus.Delivered ||
      order.status === OrderStatus.Paid
    ) {
      bill.totalAmount += order.dishSnapshot.basePrice * order.quantity;
    }
  }
  return Array.from(billMap.values());
}


// ─── Payment Dialog ────────────────────────────────────────────────────────────
function PaymentDialog({
  bill,
  open,
  onOpenChange,
  onOrderStatusChanged,
}: {
  bill: Bill | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onOrderStatusChanged: () => void;
}) {
  const [cashReceived, setCashReceived] = useState<string>("");
  const updateOrderMutation = useUpdateOrderMutation();

  // Local override map: orderId -> "Rejected" | "Delivered" (toggled by staff)
  const [localStatus, setLocalStatus] = useState<
    Record<number, (typeof OrderStatus)[keyof typeof OrderStatus]>
  >({});

  const getEffectiveStatus = (o: OrderItem) =>
    localStatus[o.id] ?? o.status;

  const toggleReject = useCallback(
    async (o: OrderItem) => {
      const current = getEffectiveStatus(o);
      const nextStatus =
        current === OrderStatus.Rejected
          ? OrderStatus.Delivered
          : OrderStatus.Rejected;

      // Optimistic local update
      setLocalStatus((prev) => ({ ...prev, [o.id]: nextStatus }));

      try {
        await updateOrderMutation.mutateAsync({
          id: o.id,
          body: {
            status: nextStatus,
            dishId: o.dishSnapshot.dishId!,
            quantity: o.quantity,
          },
        });
        onOrderStatusChanged();
      } catch (error) {
        // Revert on error
        setLocalStatus((prev) => ({ ...prev, [o.id]: current }));
        handleErrorApi({ error });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [localStatus, updateOrderMutation, onOrderStatusChanged]
  );

  // Reset local status overrides when bill changes
  const prevBillId = useRef<number | null>(null);
  if (bill && bill.guestId !== prevBillId.current) {
    prevBillId.current = bill.guestId;
    // only reset when switching to a different bill
  }

  if (!bill) return null;

  const deliveredOrders = bill.orders.filter(
    (o) =>
      getEffectiveStatus(o) === OrderStatus.Delivered ||
      getEffectiveStatus(o) === OrderStatus.Paid
  );

  const total = deliveredOrders.reduce(
    (sum, o) => sum + o.dishSnapshot.basePrice * o.quantity,
    0
  );

  const cash = Number(cashReceived.replace(/\D/g, "")) || 0;
  const change = Math.max(cash - total, 0);

  const qrUrl = `https://img.vietqr.io/image/MB-123-compact2.png?amount=${total}&addInfo=QNM_${bill.guestId}&accountName=Nha%20Hang`;

  const handlePreview = () => {
    const billForPrinting = {
      ...bill,
      orders: bill.orders.filter(o => {
        const status = getEffectiveStatus(o);
        return status === OrderStatus.Delivered || status === OrderStatus.Paid;
      }).map(o => ({
        ...o,
        status: getEffectiveStatus(o)
      })),
      totalAmount: total
    };
    const html = generateBillHtml(billForPrinting);
    const newWindow = window.open("", "_blank");
    if (newWindow) {
      newWindow.document.write(html);
      newWindow.document.close();
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between pr-6">
              <DialogTitle className="flex items-center gap-2 text-base">
                <Receipt className="h-5 w-5 text-orange-500" />
                {bill.guestName} – Bàn {bill.tableNumber ?? "?"}
              </DialogTitle>
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={handlePreview}
              >
                <Printer className="h-4 w-4" />
                Xem hóa đơn
              </Button>
            </div>
          </DialogHeader>

          {/* ── Order list with reject toggle ── */}
          <div className="space-y-1 mb-1">
            <p className="text-xs text-muted-foreground mb-2">
              Nhấn <X className="inline h-3 w-3" /> để gạch món,{" "}
              <RotateCcw className="inline h-3 w-3" /> để hoàn lại
            </p>
            {bill.orders.map((o) => {
              const effectiveStatus = getEffectiveStatus(o);
              const isActive =
                effectiveStatus === OrderStatus.Delivered ||
                effectiveStatus === OrderStatus.Paid;
              const isRejected = effectiveStatus === OrderStatus.Rejected;
              const canToggle =
                effectiveStatus === OrderStatus.Delivered ||
                effectiveStatus === OrderStatus.Paid ||
                effectiveStatus === OrderStatus.Rejected;

              return (
                <div
                  key={o.id}
                  className={`flex items-center justify-between text-sm rounded px-2 py-1 ${
                    isRejected ? "opacity-50" : ""
                  }`}
                >
                  <span
                    className={`flex-1 truncate ${
                      isRejected ? "line-through text-muted-foreground" : ""
                    }`}
                  >
                    {o.dishSnapshot.name}{" "}
                    <Badge variant="secondary" className="px-1 text-xs">
                      x{o.quantity}
                    </Badge>
                  </span>
                  <span
                    className={`mx-2 ${
                      isActive
                        ? "font-medium"
                        : "text-muted-foreground line-through"
                    }`}
                  >
                    {formatCurrency(o.dishSnapshot.basePrice * o.quantity)}
                  </span>
                  {canToggle && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-6 w-6 shrink-0 ${
                        isRejected
                          ? "text-green-600 hover:text-green-700"
                          : "text-red-500 hover:text-red-600"
                      }`}
                      title={isRejected ? "Hoàn lại món" : "Gạch món"}
                      onClick={() => toggleReject(o)}
                      disabled={updateOrderMutation.isPending}
                    >
                      {isRejected ? (
                        <RotateCcw className="h-3.5 w-3.5" />
                      ) : (
                        <X className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  )}
                  {!canToggle && (
                    <span className="text-xs text-muted-foreground ml-2">
                      {effectiveStatus === OrderStatus.Pending
                        ? "Chờ"
                        : effectiveStatus === OrderStatus.Processing
                        ? "Đang làm"
                        : ""}
                    </span>
                  )}
                </div>
              );
            })}

            <div className="border-t pt-2 flex justify-between font-bold text-base mt-2">
              <span>Tổng cộng ({deliveredOrders.length} món đã giao)</span>
              <span className="text-orange-600">{formatCurrency(total)}</span>
            </div>
          </div>

          <Tabs defaultValue="cash">
            <TabsList className="w-full">
              <TabsTrigger value="cash" className="flex-1 gap-1">
                <Banknote className="h-4 w-4" /> Tiền mặt
              </TabsTrigger>
              <TabsTrigger value="bank" className="flex-1 gap-1">
                <CreditCard className="h-4 w-4" /> Chuyển khoản
              </TabsTrigger>
            </TabsList>

            {/* === CASH TAB === */}
            <TabsContent value="cash" className="space-y-4 pt-3">
              <div className="space-y-2">
                <Label htmlFor="cash-received">Tiền khách đưa (VNĐ)</Label>
                <Input
                  id="cash-received"
                  inputMode="numeric"
                  placeholder="Nhập số tiền..."
                  value={cashReceived}
                  onChange={(e) =>
                    setCashReceived(e.target.value.replace(/\D/g, ""))
                  }
                  className="text-lg font-semibold"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {[50000, 100000, 200000, 500000, 1000000].map((v) => (
                  <Button
                    key={v}
                    variant="outline"
                    size="sm"
                    onClick={() => setCashReceived(String(v))}
                  >
                    {formatCurrency(v)}
                  </Button>
                ))}
              </div>
              <div className="rounded-md bg-muted p-3 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Cần thanh toán</span>
                  <span className="font-medium">{formatCurrency(total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Khách đưa</span>
                  <span className="font-medium">{formatCurrency(cash)}</span>
                </div>
                <div className="flex justify-between font-bold text-base border-t pt-1">
                  <span>Tiền trả lại</span>
                  <span className={change > 0 ? "text-green-600" : "text-muted-foreground"}>
                    {formatCurrency(change)}
                  </span>
                </div>
              </div>
            </TabsContent>

            {/* === BANK TAB === */}
            <TabsContent value="bank" className="pt-3 space-y-3">
              <p className="text-sm text-muted-foreground">
                Yêu cầu khách quét mã QR bên dưới để thanh toán qua MB Bank.
                Nội dung:{" "}
                <span className="font-semibold text-foreground">
                  QNM_{bill.guestId}
                </span>
              </p>
              <div className="flex justify-center">
                <Image
                  src={qrUrl}
                  alt="QR MB Bank"
                  width={260}
                  height={300}
                  className="rounded-xl border shadow-sm"
                  unoptimized
                />
              </div>
              <p className="text-xs text-center text-muted-foreground">
                STK: <strong>123</strong> – MB Bank –{" "}
                <strong>{formatCurrency(total)}</strong>
              </p>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ─── Main BillTable ────────────────────────────────────────────────────────────
export default function BillTable() {
  const { data, isPending, refetch } = useGetBillList();
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [paymentOpen, setPaymentOpen] = useState(false);
  
  const bills = useMemo(
    () => groupOrdersIntoBills(data?.payload?.data ?? []),
    [data]
  );

  const openPayment = (bill: Bill) => {
    setSelectedBill(bill);
    setPaymentOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Tổng <strong>{bills.length}</strong> hóa đơn
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="gap-1"
        >
          <RefreshCcw className="h-4 w-4" />
          Làm mới
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bàn</TableHead>
              <TableHead>Khách hàng</TableHead>
              <TableHead>Số món</TableHead>
              <TableHead>Tổng tiền (món đã giao)</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : bills.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  Chưa có hóa đơn nào.
                </TableCell>
              </TableRow>
            ) : (
              bills.map((bill) => (
                <TableRow key={bill.guestId}>
                  <TableCell className="font-medium">
                    {bill.tableNumber ?? "?"}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{bill.guestName}</span>
                      <span className="text-xs text-muted-foreground">
                        #{bill.guestId}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{bill.totalItems} món</Badge>
                  </TableCell>
                  <TableCell className="font-semibold text-orange-600">
                    {formatCurrency(bill.totalAmount)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      className="bg-orange-500 hover:bg-orange-600 text-white gap-1"
                      onClick={() => openPayment(bill)}
                    >
                      <Receipt className="h-4 w-4" />
                      Thanh toán
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <PaymentDialog
        bill={selectedBill}
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
        onOrderStatusChanged={refetch}
      />
    </div>
  );
}
