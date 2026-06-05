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
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useEffect } from "react";
import {
  UpdateBranchBody,
  UpdateBranchBodyType,
} from "../../../type/schema/branch.schema";
import {
  useGetBranchDetail,
  useUpdateBranchMutation,
} from "@/lib/query/useBranch";
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

const getOpenMapUrl = (value?: string) => {
  const src = getMapSrcFromInput(value);
  if (!src) return "";
  return src;
};

export default function EditBranch({
  id,
  setId,
  onSubmitSuccess,
}: {
  id?: number | undefined;
  setId: (value: number | undefined) => void;
  onSubmitSuccess?: () => void;
}) {
  const form = useForm<UpdateBranchBodyType>({
    resolver: zodResolver(UpdateBranchBody) as Resolver<UpdateBranchBodyType>,
    defaultValues: {
      name: "",
      image: "",
      address: "",
      link: "",
      hotline: "",
      rating: 0,
      open: "",
      close: "",
    },
  });

  const updateBranchMutation = useUpdateBranchMutation();
  const { data } = useGetBranchDetail(id ?? 0);
  const mapLink = form.watch("link");
  const mapSrc = getMapSrcFromInput(mapLink);

  useEffect(() => {
    if (id && data?.payload?.data) {
      const { name, image, address, link, hotline, rating, open, close } =
        data.payload.data;
      form.reset({
        name,
        image,
        address,
        link,
        hotline,
        rating,
        open,
        close,
      });
    }
  }, [id, data, form]);

  const reset = () => {
    form.reset();
  };

  const onSubmit = async (data: UpdateBranchBodyType) => {
    if (updateBranchMutation.isPending || !id) return;
    try {
      updateBranchMutation.mutate(
        { id, body: data },
        {
          onSuccess: (result) => {
            toast.success("Cập nhật chi nhánh thành công", {
              description: result.payload.message,
              duration: 5000,
            });
            reset();
            setId(undefined);
            onSubmitSuccess && onSubmitSuccess();
          },
        },
      );
    } catch (error) {
      handleErrorApi({ error, setError: form.setError });
    }
  };

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
          <DialogTitle>Cập nhật chi nhánh</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            className="grid auto-rows-max items-start gap-4 md:gap-8"
            id="edit-branch-form"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="grid gap-4 py-4">
              <FormItem>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label>ID</Label>
                  <div className="col-span-3 w-full">
                    <Input value={id} readOnly />
                  </div>
                </div>
              </FormItem>

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
                        <Input id="link" className="w-full" {...field} />
                        {mapSrc && (
                          <div className="space-y-2">
                            <iframe
                              src={mapSrc}
                              width="100%"
                              height="240"
                              style={{ border: 0 }}
                              loading="lazy"
                              referrerPolicy="no-referrer-when-downgrade"
                              title="Google map preview"
                            />
                          </div>
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
                          className="w-full"
                          type="number"
                          step="0.1"
                          min={0}
                          max={5}
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
            form="edit-branch-form"
            disabled={updateBranchMutation.isPending}
          >
            {updateBranchMutation.isPending
              ? "Đang cập nhật..."
              : "Cập nhật chi nhánh"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
