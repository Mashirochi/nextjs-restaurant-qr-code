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
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import {
  CreateBranchBody,
  CreateBranchBodyType,
} from "../../../type/schema/branch.schema";
import { useAddBranchMutation } from "@/lib/query/useBranch";
import { handleErrorApi } from "@/lib/utils";
import { toast } from "sonner";

const getMapSrcFromInput = (value?: string) => {
  if (!value) return "";
  const trimmed = value.trim();
  if (!trimmed) return "";

  if (trimmed.includes("<iframe")) {
    const matched = trimmed.match(/src=["']([^"']+)["']/i);
    return matched?.[1] ?? "";
  }

  return trimmed;
};

export default function AddBranch() {
  const [open, setOpen] = useState(false);
  const [showMapPreview, setShowMapPreview] = useState(false);
  const form = useForm<CreateBranchBodyType>({
    resolver: zodResolver(CreateBranchBody) as Resolver<CreateBranchBodyType>,
    defaultValues: {
      name: "",
      image: "",
      address: "",
      link: "",
      hotline: "",
      rating: 0,
      open: "08:00",
      close: "22:00",
    },
  });

  const addBranchMutation = useAddBranchMutation();
  const mapLink = form.watch("link");
  const mapSrc = getMapSrcFromInput(mapLink);

  const reset = () => {
    form.reset();
  };

  const onSubmit = async (data: CreateBranchBodyType) => {
    if (addBranchMutation.isPending) return;
    try {
      addBranchMutation.mutate(data, {
        onSuccess: () => {
          reset();
          setOpen(false);
          toast.success("Thêm chi nhánh thành công");
        },
      });
    } catch (error) {
      handleErrorApi({ error, setError: form.setError });
    }
  };

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
            Thêm chi nhánh
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[600px] max-h-screen overflow-auto"
        onCloseAutoFocus={() => form.reset()}
      >
        <DialogHeader>
          <DialogTitle>Thêm chi nhánh</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            className="grid auto-rows-max items-start gap-4 md:gap-8"
            id="add-branch-form"
            onSubmit={handleSubmit}
          >
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="name">Tên chi nhánh</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input id="name" className="w-full" {...field} />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="address">Địa chỉ</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input id="address" className="w-full" {...field} />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="image">Ảnh (URL)</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input id="image" className="w-full" {...field} />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="link">Google map link</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input
                          id="link"
                          className="w-full"
                          {...field}
                          onChange={(event) => {
                            field.onChange(event.target.value);
                            setShowMapPreview(false);
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            if (!mapSrc) {
                              toast.error("Link iframe không hợp lệ");
                              return;
                            }
                            setShowMapPreview(true);
                          }}
                        >
                          Check map
                        </Button>
                        {showMapPreview && mapSrc && (
                          <iframe
                            src={mapSrc}
                            width="100%"
                            height="240"
                            style={{ border: 0 }}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Google map preview"
                          />
                        )}
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hotline"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="hotline">Hotline</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input id="hotline" className="w-full" {...field} />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="rating">Rating</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input
                          id="rating"
                          type="number"
                          step="0.1"
                          min={0}
                          max={5}
                          className="w-full"
                          value={field.value ?? 0}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="open"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="open">Giờ mở cửa</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input id="open" className="w-full" {...field} />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="close"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="close">Giờ đóng cửa</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input id="close" className="w-full" {...field} />
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
          <Button
            type="submit"
            form="add-branch-form"
            disabled={addBranchMutation.isPending}
          >
            {addBranchMutation.isPending ? "Đang thêm..." : "Thêm chi nhánh"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
