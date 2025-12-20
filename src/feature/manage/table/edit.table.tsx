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
import { Resolver, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  getTableLink,
  getVietnameseTableStatus,
  handleErrorApi,
} from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { TableStatus, TableStatusValues } from "@/type/constant";
import {
  UpdateTableBody,
  UpdateTableBodyType,
} from "@/type/schema/table.schema";
import {
  useGetTableDetail,
  useUpdateTableMutation,
} from "@/lib/query/useTable";
import { toast } from "sonner";
import { useEffect } from "react";

export default function EditTable({
  id,
  setId,
  onSubmitSuccess,
}: {
  id?: number | undefined;
  setId: (value: number | undefined) => void;
  onSubmitSuccess?: () => void;
}) {
  const form = useForm<UpdateTableBodyType>({
    resolver: zodResolver(UpdateTableBody) as Resolver<UpdateTableBodyType>,
    defaultValues: {
      capacity: 2,
      status: TableStatus.Hidden,
      changeToken: false,
    },
  });
  const updateTableMutation = useUpdateTableMutation();
  const { data } = useGetTableDetail(id ?? 0);

  const tableNumber = id ?? 0;

  const reset = () => {
    form.reset();
  };

  const onSubmit = async (data: UpdateTableBodyType) => {
    if (updateTableMutation.isPending || !id) return;
    try {
      updateTableMutation.mutate(
        {
          id,
          body: data,
        },
        {
          onSuccess: (result) => {
            toast.success("Cập nhật món ăn thành công", {
              description: result.payload.message,
              duration: 5000,
            });
            reset();
            setId(undefined);
            onSubmitSuccess && onSubmitSuccess();
          },
        }
      );
    } catch (error) {
      console.error("Error in form submission:", error);
      handleErrorApi({ error, setError: form.setError });
    }
  };

  const isLoading =
    updateTableMutation.isPending || updateTableMutation.isPending;

  useEffect(() => {
    if (id && data?.payload?.data) {
      const { capacity, number, status } = data.payload.data;
      form.reset({
        capacity,
        status,
        changeToken: false,
      });
    }
  }, [id, data, form]);

  if (!id) return null;

  return (
    <Dialog
      open={Boolean(id)}
      onOpenChange={(value) => {
        if (!value) {
          setId(undefined);
        }
      }}
    >
      <DialogContent
        className="sm:max-w-[600px] max-h-screen overflow-auto"
        onCloseAutoFocus={() => {
          form.reset();
          setId(undefined);
        }}
      >
        <DialogHeader>
          <DialogTitle>Cập nhật bàn ăn</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            className="grid auto-rows-max items-start gap-4 md:gap-8"
            id="edit-table-form"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="grid gap-4 py-4">
              <FormItem>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label>Số hiệu bàn</Label>
                  <div className="col-span-3 w-full">
                    <Input value={tableNumber} readOnly />
                  </div>
                </div>
              </FormItem>

              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="price">Sức chứa (người)</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input
                          id="capacity"
                          className="w-full"
                          {...field}
                          type="number"
                          onChange={(e) => field.onChange(+e.target.value)}
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
                      <Label htmlFor="description">Trạng thái</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {TableStatusValues.map((status) => (
                              <SelectItem key={status} value={status}>
                                {getVietnameseTableStatus(status)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="changeToken"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label>Đổi QR Code</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormItem>
                <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                  <Label>URL gọi món (guest)</Label>
                  <div className="col-span-3 w-full space-y-2">
                    <Link
                      href={getTableLink(
                        tableNumber,
                        data?.payload?.data.token ?? ""
                      )}
                      target="_blank"
                      className="break-all"
                    >
                      {getTableLink(
                        tableNumber,
                        data?.payload?.data.token ?? ""
                      )}
                    </Link>
                  </div>
                </div>
              </FormItem>
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button type="submit" form="edit-table-form" disabled={isLoading}>
            {isLoading ? "Đang cập nhật..." : "Cập nhật bàn ăn"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
