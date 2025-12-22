"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { getVietnameseOrderStatus, handleErrorApi } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import {
  UpdateOrderBody,
  UpdateOrderBodyType,
} from "@/type/schema/order.schema";
import { DishListResType } from "@/type/schema/dish.schema";
import { OrderStatus, OrderStatusValues } from "@/type/constant";
import { DishesDialog } from "./dishes-dialog";
import { useGetOrderById, useUpdateOrderMutation } from "@/lib/query/useOrder";
import { toast } from "sonner";

interface DishSnapshot {
  id: number;
  name: string;
  virtualPrice: number;
  basePrice: number;
  image: string;
  status: "Available" | "Unavailable" | "Hidden";
  dishId: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export default function EditOrder({
  id,
  setId,
  onSubmitSuccess,
}: {
  id?: number | undefined;
  setId: (value: number | undefined) => void;
  onSubmitSuccess?: () => void;
}) {
  const [selectedDish, setSelectedDish] = useState<
    DishListResType["data"][0] | null
  >(null);
  const updateOrderMutation = useUpdateOrderMutation();
  const { data } = useGetOrderById(id!);

  const form = useForm<UpdateOrderBodyType>({
    resolver: zodResolver(UpdateOrderBody),
    defaultValues: {
      status: OrderStatus.Pending,
      dishId: 0,
      quantity: 1,
    },
  });

  const onSubmit = async (values: UpdateOrderBodyType) => {
    if (updateOrderMutation.isPending || !id) {
      return;
    }
    try {
      let body: UpdateOrderBodyType & { orderId: number } = {
        ...values,
        orderId: id,
      };
      const res = await updateOrderMutation.mutateAsync({
        id: body.orderId,
        body: {
          status: body.status,
          dishId: body.dishId ?? 0, // Provide default value if dishId is undefined
          quantity: body.quantity,
        },
      });
      toast.success("Cập nhật đơn hàng thành công.");
      onSubmitSuccess?.();
      reset();
    } catch (error) {
      toast.error("Cập nhật đơn hàng thất bại. Vui lòng thử lại.");
      handleErrorApi({
        error,
        setError: form.setError,
      });
    }
  };

  const reset = () => {
    setId(undefined);
  };

  useEffect(() => {
    if (data && id) {
      const {
        status,
        dishSnapshot: { dishId },
        quantity,
      } = data.payload.data;
      form.reset({
        status,
        dishId: dishId ?? undefined,
        quantity,
      });
      // Create a compatible dish object from dishSnapshot
      const dishSnapshot = data.payload.data.dishSnapshot;
      const compatibleDish = {
        id: dishSnapshot.id,
        name: dishSnapshot.name,
        virtualPrice: dishSnapshot.virtualPrice.toString(),
        basePrice: dishSnapshot.basePrice !== null ? dishSnapshot.basePrice.toString() : null,
        image: dishSnapshot.image,
        status: dishSnapshot.status,
        // We're providing a default value for 'type' since it's required in DishListResType but not in dishSnapshot
        type: "Thịt bò" as const, // Default value, will be overridden when user selects a dish
        createdAt: dishSnapshot.createdAt,
        updatedAt: dishSnapshot.updatedAt,
      };
      setSelectedDish(compatibleDish);
    }
  }, [data, id, form]);

  return (
    <Dialog
      open={Boolean(id)}
      onOpenChange={(value) => {
        if (!value) {
          reset();
        }
      }}
    >
      <DialogContent className="sm:max-w-[600px] max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>Cập nhật đơn hàng</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            className="grid auto-rows-max items-start gap-4 md:gap-8"
            id="edit-order-form"
            onSubmit={form.handleSubmit(onSubmit, console.log)}
          >
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="dishId"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center justify-items-start gap-4">
                    <FormLabel>Món ăn</FormLabel>
                    <div className="flex items-center col-span-2 space-x-4">
                      <Avatar className="aspect-square w-[50px] h-[50px] rounded-md object-cover">
                        <AvatarImage src={selectedDish?.image} />
                        <AvatarFallback className="rounded-none">
                          {selectedDish?.name}
                        </AvatarFallback>
                      </Avatar>
                      <div>{selectedDish?.name}</div>
                    </div>

                    <DishesDialog
                      onChoose={(dish) => {
                        field.onChange(dish.id);
                        setSelectedDish(dish);
                      }}
                    />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="quantity">Số lượng</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input
                          id="quantity"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          className="w-16 text-center"
                          {...field}
                          value={field.value}
                          onChange={(e) => {
                            let value = e.target.value;
                            const numberValue = Number(value);
                            if (isNaN(numberValue)) {
                              return;
                            }
                            field.onChange(numberValue);
                          }}
                        />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <FormLabel>Trạng thái</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl className="col-span-3">
                          <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Trạng thái" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {OrderStatusValues.map((status) => (
                            <SelectItem key={status} value={status}>
                              {getVietnameseOrderStatus(status)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button type="submit" form="edit-order-form">
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
