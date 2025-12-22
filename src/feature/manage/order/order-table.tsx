"use client";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { endOfDay, format, startOfDay } from "date-fns";
import { OrderStatusValues } from "@/type/constant";
import { createContext, useEffect, useState } from "react";
import {
  GetOrdersResType,
  UpdateOrderResType,
} from "@/type/schema/order.schema";
import { useSearchParams } from "next/navigation";
import { useOrderService } from "./order.service";
import orderTableColumns from "./order-table-columns";
import { Button } from "@/components/ui/button";
import AddOrder from "./add-order";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import OrderStatics from "./order-statics";
import AutoPagination from "@/components/custom/auto.pagination";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  cn,
  getOrderStatusText,
  getVietnameseOrderStatus,
  handleErrorApi,
} from "@/lib/utils";
import EditOrder from "./edit-order";
import { useGetOrderList, useUpdateOrderMutation } from "@/lib/query/useOrder";
import { useGetTableList } from "@/lib/query/useTable";
import TableSkeleton from "./table-skeleton";
import socket from "@/lib/websocket/socket";
import { toast } from "sonner";
import { GuestCreateOrdersResType } from "@/type/schema/guest.schema";

export const OrderTableContext = createContext({
  setOrderIdEdit: (value: number | undefined) => {},
  orderIdEdit: undefined as number | undefined,
  changeStatus: (payload: {
    orderId: number;
    dishId: number;
    status: (typeof OrderStatusValues)[number];
    quantity: number;
  }) => Promise.resolve(),
  orderObjectByGuestId: {} as OrderObjectByGuestID,
});

export type StatusCountObject = Record<
  (typeof OrderStatusValues)[number],
  number
>;
export type Statics = {
  status: StatusCountObject;
  table: Record<number, Record<number, StatusCountObject>>;
};
export type OrderObjectByGuestID = Record<number, GetOrdersResType["data"]>;
export type ServingGuestByTableNumber = Record<number, OrderObjectByGuestID>;

const PAGE_SIZE = 10;
const initFromDate = startOfDay(new Date());
const initToDate = endOfDay(new Date());
export default function OrderTable() {
  const searchParam = useSearchParams();
  const [openStatusFilter, setOpenStatusFilter] = useState(false);
  const [fromDate, setFromDate] = useState(initFromDate);
  const [toDate, setToDate] = useState(initToDate);
  const page = searchParam.get("page") ? Number(searchParam.get("page")) : 1;
  const pageIndex = page - 1;
  const [orderIdEdit, setOrderIdEdit] = useState<number | undefined>();
  const tableListQuery = useGetTableList();

  const tableList = tableListQuery.data?.payload?.data || [];
  const tableListSortedByNumber = tableList.sort((a, b) => a.number - b.number);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex,
    pageSize: PAGE_SIZE,
  });
  const updateOrderMutation = useUpdateOrderMutation();
  const orderListQuery = useGetOrderList({
    fromDate,
    toDate,
  });
  const orderList = orderListQuery.data?.payload?.data || [];
  const refetchOrderList = orderListQuery.refetch;
  const { statics, orderObjectByGuestId, servingGuestByTableNumber } =
    useOrderService(orderList);

  const changeStatus = async (body: {
    orderId: number;
    dishId: number;
    status: (typeof OrderStatusValues)[number];
    quantity: number;
  }) => {
    try {
      await updateOrderMutation.mutateAsync({
        id: body.orderId,
        body: {
          status: body.status,
          dishId: body.dishId,
          quantity: body.quantity,
        },
      });
    } catch (error) {
      handleErrorApi({
        error,
      });
    }
  };

  const table = useReactTable({
    data: orderList,
    columns: orderTableColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    autoResetPageIndex: false,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  useEffect(() => {
    table.setPagination({
      pageIndex,
      pageSize: PAGE_SIZE,
    });
  }, [table, pageIndex]);

  const resetDateFilter = () => {
    setFromDate(initFromDate);
    setToDate(initToDate);
  };

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      console.log(socket.id);
    }

    function onDisconnect() {}

    function onOrderUpdate(data: UpdateOrderResType["data"]) {
      const { dishSnapshot, quantity, status } = data;
      toast.success(
        `Đơn hàng "${
          dishSnapshot.name
        }" với số lượng (x${quantity}) đã được cập nhật trạng thái: ${getOrderStatusText(
          status
        )}`
      );
      refetch();
    }

    function onNewOrder(data: GuestCreateOrdersResType["data"]) {
      const { guest } = data[0];
      toast.success(
        `Khách hàng "${guest?.name ?? "Không Biết Đặt Tên"}" tại bàn ${
          guest?.tableNumber ?? "Không xác định"
        } đã tạo ${data.length} đơn hàng mới.`
      );
      refetch();
    }

    function refetch() {
      const now = new Date();
      if (now >= fromDate && now <= toDate) {
        refetchOrderList();
      }
    }
    socket.on("connect", onConnect);
    socket.on("update-order", onOrderUpdate);
    socket.on("new-order", onNewOrder);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("update-order", onOrderUpdate);
      socket.off("new-order", onNewOrder);
    };
  }, [refetchOrderList, fromDate, toDate]);

  return (
    <OrderTableContext.Provider
      value={{
        orderIdEdit,
        setOrderIdEdit,
        changeStatus,
        orderObjectByGuestId,
      }}
    >
      <div className="w-full">
        <EditOrder
          id={orderIdEdit}
          setId={setOrderIdEdit}
          onSubmitSuccess={() => {}}
        />
        <div className=" flex items-center">
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center">
              <span className="mr-2">Từ</span>
              <Input
                type="datetime-local"
                placeholder="Từ ngày"
                className="text-sm"
                value={format(fromDate, "yyyy-MM-dd HH:mm").replace(" ", "T")}
                onChange={(event) => setFromDate(new Date(event.target.value))}
              />
            </div>
            <div className="flex items-center">
              <span className="mr-2">Đến</span>
              <Input
                type="datetime-local"
                placeholder="Đến ngày"
                value={format(toDate, "yyyy-MM-dd HH:mm").replace(" ", "T")}
                onChange={(event) => setToDate(new Date(event.target.value))}
              />
            </div>
            <Button className="" variant={"outline"} onClick={resetDateFilter}>
              Reset
            </Button>
          </div>
          <div className="ml-auto">
            <AddOrder />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 py-4">
          <Input
            placeholder="Tên khách"
            value={
              (table.getColumn("guestName")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("guestName")?.setFilterValue(event.target.value)
            }
            className="max-w-[100px]"
          />
          <Input
            placeholder="Số bàn"
            value={
              (table.getColumn("tableNumber")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("tableNumber")?.setFilterValue(event.target.value)
            }
            className="max-w-[80px]"
          />
          <Popover open={openStatusFilter} onOpenChange={setOpenStatusFilter}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openStatusFilter}
                className="w-[150px] text-sm justify-between"
              >
                {table.getColumn("status")?.getFilterValue()
                  ? getVietnameseOrderStatus(
                      table
                        .getColumn("status")
                        ?.getFilterValue() as (typeof OrderStatusValues)[number]
                    )
                  : "Trạng thái"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandGroup>
                  <CommandList>
                    {OrderStatusValues.map((status) => (
                      <CommandItem
                        key={status}
                        value={status}
                        onSelect={(currentValue) => {
                          table
                            .getColumn("status")
                            ?.setFilterValue(
                              currentValue ===
                                table.getColumn("status")?.getFilterValue()
                                ? ""
                                : currentValue
                            );
                          setOpenStatusFilter(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            table.getColumn("status")?.getFilterValue() ===
                              status
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {getVietnameseOrderStatus(status)}
                      </CommandItem>
                    ))}
                  </CommandList>
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <OrderStatics
          statics={statics}
          tableList={tableListSortedByNumber}
          servingGuestByTableNumber={servingGuestByTableNumber}
        />
        {orderListQuery.isPending && <TableSkeleton />}

        {!orderListQuery.isPending && (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={orderTableColumns.length}
                        className="h-24 text-center"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
              <div className="text-xs text-muted-foreground py-4 flex-1 ">
                Hiển thị{" "}
                <strong>{table.getPaginationRowModel().rows.length}</strong>{" "}
                trong <strong>{orderList.length}</strong> kết quả
              </div>
              <div>
                <AutoPagination
                  page={table.getState().pagination.pageIndex + 1}
                  pageSize={table.getPageCount()}
                  pathname="/manage/orders"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </OrderTableContext.Provider>
  );
}
