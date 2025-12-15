"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getVietnameseDishStatus, handleErrorApi } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  UpdateDishBody,
  UpdateDishBodyType,
  DishType,
  DishTypeValues,
} from "@/type/schema/dish.schema";
import { DishStatus, DishStatusValues } from "@/type/constant";
import { useGetDishDetail, useUpdateDishMutation } from "@/lib/query/useDish";
import { useUploadMediaMutation } from "@/lib/query/useAccount";
import { toast } from "sonner";
import envConfig from "@/lib/validateEnv";

export default function EditDish({
  id,
  setId,
  onSubmitSuccess,
}: {
  id?: number | undefined;
  setId: (value: number | undefined) => void;
  onSubmitSuccess?: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const updateDishMutation = useUpdateDishMutation();
  const uploadMediaMutation = useUploadMediaMutation();
  const { data } = useGetDishDetail(id ?? 0);
  const form = useForm<UpdateDishBodyType>({
    resolver: zodResolver(UpdateDishBody),
    defaultValues: {
      name: "",
      virtualPrice: 0,
      basePrice: 0,
      image: "",
      status: DishStatus.Unavailable,
      type: DishType.Thit,
    },
  });
  const image = form.watch("image");
  const name = form.watch("name");
  // Format the image URL to ensure it's correctly prefixed
  const formatImageUrl = (imageUrl: string | undefined) => {
    if (!imageUrl) return "";
    // If it's already a full URL or already formatted, return as is
    if (imageUrl.startsWith("http") || imageUrl.startsWith("/static/")) {
      return imageUrl;
    }
    // Otherwise, prepend the API endpoint and static path
    return `${envConfig.NEXT_PUBLIC_API_ENDPOINT}/static/dishes/${imageUrl}`;
  };

  const previewAvatarFromFile = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file);
    }
    return formatImageUrl(image);
  }, [file, image]);

  useEffect(() => {
    if (id && data?.payload?.data) {
      const { name, image, virtualPrice, basePrice, status, type } =
        data.payload.data;
      form.reset({
        name,
        image: image ?? "",
        virtualPrice,
        basePrice: basePrice ?? 0,
        status,
        type,
      });
    }
  }, [id, data, form]);

  const reset = () => {
    form.reset();
    setFile(null);
    setId(undefined);
  };

  const onSubmit = async (data: UpdateDishBodyType) => {
    if (updateDishMutation.isPending || !id) return;
    try {
      // Convert string values to numbers
      const processedData: UpdateDishBodyType = {
        name: data.name,
        image: data.image,
        virtualPrice: Number(data.virtualPrice),
        basePrice: data.basePrice ? Number(data.basePrice) : undefined,
        status: data.status,
        type: data.type,
      };
      
      let finalData: UpdateDishBodyType = processedData;

      if (file) {
        try {
          const formData = new FormData();
          formData.append("file", file);
          const uploadResult = await uploadMediaMutation.mutateAsync({
            formData,
            folder: "dishes",
          });
          finalData = {
            ...finalData,
            image: uploadResult.payload.data,
          };
        } catch (uploadError) {
          console.error("Error uploading file:", uploadError);
          handleErrorApi({ error: uploadError, setError: form.setError });
          return;
        }
      }

      updateDishMutation.mutate(
        {
          id,
          body: finalData,
        },
        {
          onSuccess: (result) => {
            toast.success("Cập nhật món ăn thành công", {
              description: result.payload.message,
              duration: 5000,
            });
            reset();
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
    updateDishMutation.isPending || uploadMediaMutation.isPending;

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
      <DialogContent className="sm:max-w-[600px] max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>Cập nhật món ăn</DialogTitle>
          <DialogDescription>
            Các trường sau đây là bắ buộc: Tên, ảnh
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            className="grid auto-rows-max items-start gap-4 md:gap-8"
            id="edit-dish-form"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex gap-2 items-start justify-start">
                      <Avatar className="aspect-square w-[100px] h-[100px] rounded-md object-cover">
                        <AvatarImage src={previewAvatarFromFile} />
                        <AvatarFallback className="rounded-none">
                          {name || "Avatar"}
                        </AvatarFallback>
                      </Avatar>
                      <input
                        type="file"
                        accept="image/*"
                        ref={imageInputRef}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setFile(file);
                            // Don't set a temporary URL here since we're using previewAvatarFromFile
                            field.onChange("");
                          }
                        }}
                        className="hidden"
                      />
                      <button
                        className="flex aspect-square w-[100px] items-center justify-center rounded-md border border-dashed"
                        type="button"
                        onClick={() => imageInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4 text-muted-foreground" />
                        <span className="sr-only">Upload</span>
                      </button>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="name">Tên món ăn</Label>
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
                name="virtualPrice"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="virtualPrice">Giá ảo</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input
                          id="virtualPrice"
                          className="w-full"
                          {...field}
                          type="number"
                        />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="basePrice"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="basePrice">Giá</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input
                          id="basePrice"
                          className="w-full"
                          {...field}
                          type="number"
                        />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label>Loại món</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn loại món ăn" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {DishTypeValues.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
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
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="description">Trạng thái</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {DishStatusValues.map((status) => (
                              <SelectItem key={status} value={status}>
                                {getVietnameseDishStatus(status)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button type="submit" form="edit-dish-form">
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
