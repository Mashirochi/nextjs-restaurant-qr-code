"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle } from "lucide-react";
import { FormEvent, useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableStatus, TableStatusValues } from "@/type/constant";
import {
  CreateTableBody,
  CreateTableBodyType,
} from "@/type/schema/table.schema";
import { getVietnameseTableStatus, handleErrorApi } from "@/lib/utils";
import { useAddTableMutation } from "@/lib/query/useTable";
import { toast } from "sonner";

export default function AddTable() {
  const [open, setOpen] = useState(false);
  const form = useForm<CreateTableBodyType>({
    resolver: zodResolver(CreateTableBody) as Resolver<CreateTableBodyType>,
    defaultValues: {
      number: 1,
      capacity: 2,
      status: TableStatus.Hidden,
    },
  });

  const addTableMutation = useAddTableMutation();

  const reset = () => {
    form.reset();
  };

  const onSubmit = async (data: CreateTableBodyType) => {
    if (addTableMutation.isPending) return;
    try {
      addTableMutation.mutate(data, {
        onSuccess: () => {
          reset();
          setOpen(false);
          toast.success("Thêm bàn ăn thành công");
        },
      });
    } catch (error) {
      console.error("Error in form submission:", error);
      handleErrorApi({ error, setError: form.setError });
    }
  };

  const isLoading = addTableMutation.isPending || addTableMutation.isPending;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    form.handleSubmit(onSubmit)(event);
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-7 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Thêm bàn
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[600px] max-h-screen overflow-auto"
        onCloseAutoFocus={() => form.reset()}
      >
        <DialogHeader>
          <DialogTitle>Thêm bàn</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            className="grid auto-rows-max items-start gap-4 md:gap-8"
            id="add-table-form"
            onSubmit={handleSubmit}
          >
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="number"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="name">Số hiệu bàn</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input
                          id="number"
                          type="number"
                          className="w-full"
                          {...field}
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
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="price">Lượng khách cho phép</Label>
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
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button type="submit" form="add-table-form" disabled={isLoading}>
            {isLoading ? "Đang thêm..." : "Thêm bàn"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
