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
import { Switch } from "@/components/ui/switch";
import {
  UpdateEmployeeAccountBody,
  UpdateEmployeeAccountBodyType,
} from "@/type/schema/account.schema";
import {
  useGetEmployeeAccount,
  useUpdateAccountMutation,
  useUploadMediaMutation,
} from "@/lib/query/useAccount";
import envConfig from "@/lib/validateEnv";
import { handleErrorApi } from "@/lib/utils";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Role, RoleValues } from "@/type/constant";

// Create a form-specific type that matches the expected structure
type EditEmployeeFormValues = Omit<UpdateEmployeeAccountBodyType, "role"> & {
  role?: "Owner" | "Employee";
};

export default function EditEmployee({
  id,
  setId,
  onSubmitSuccess,
}: {
  id?: number | undefined;
  setId: (value: number | undefined) => void;
  onSubmitSuccess?: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const updateAccountMutation = useUpdateAccountMutation();
  const uploadMediaMutation = useUploadMediaMutation();
  // Always call the hook, but it will only fetch data when id exists (enabled: !!id is in the hook)
  const { data } = useGetEmployeeAccount(id ?? 0);

  const form = useForm<EditEmployeeFormValues>({
    resolver: zodResolver(UpdateEmployeeAccountBody),
    defaultValues: {
      name: "",
      email: "",
      avatar: undefined,
      password: undefined,
      confirmPassword: undefined,
      changePassword: false,
      role: Role.Employee,
    },
  });

  const avatar = form.watch("avatar");
  const name = form.watch("name");
  const changePassword = form.watch("changePassword");
  const formatAvatarUrl = (avatarUrl: string | undefined) => {
    if (!avatarUrl) return "";
    if (avatarUrl.startsWith("http") || avatarUrl.startsWith("/static/")) {
      return avatarUrl;
    }
    return `${envConfig.NEXT_PUBLIC_API_ENDPOINT}/static/avatars/${avatarUrl}`;
  };

  const previewAvatarFromFile = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file);
    }
    return formatAvatarUrl(avatar);
  }, [file, avatar]);

  useEffect(() => {
    if (id && data?.payload?.data) {
      const { name, avatar, email } = data.payload.data;
      form.reset({
        avatar: avatar ?? undefined,
        name,
        email,
        changePassword: false,
        password: form.getValues("password"),
        confirmPassword: form.getValues("confirmPassword"),
        role: data.payload.data.role,
      });
    }
  }, [id, data, form]);

  if (!id) return null;

  const reset = () => {
    form.reset();
    setFile(null);
    setId(undefined);
  };

  const onSubmit = async (data: EditEmployeeFormValues) => {
    if (updateAccountMutation.isPending || !id) return;
    try {
      let finalData: UpdateEmployeeAccountBodyType = {
        name: data.name,
        email: data.email,
        avatar: data.avatar,
        changePassword: data.changePassword,
        password: data.password,
        confirmPassword: data.confirmPassword,
        role: data.role || "Employee",
      };

      console.log(finalData);
      if (file) {
        try {
          const formData = new FormData();
          formData.append("file", file);
          const uploadResult = await uploadMediaMutation.mutateAsync({
            formData,
            folder: "avatars",
          });
          finalData = {
            ...finalData,
            avatar: uploadResult.payload.data,
          };
        } catch (uploadError) {
          console.error("Error uploading file:", uploadError);
          handleErrorApi({ error: uploadError, setError: form.setError });
          return;
        }
      }

      updateAccountMutation.mutate(
        {
          id,
          body: finalData,
        },
        {
          onSuccess: (result) => {
            toast.success("Cập nhật thông tin thành công", {
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
          <DialogTitle>Cập nhật tài khoản</DialogTitle>
          <DialogDescription>
            Các trường tên, email, mật khẩu là bắt buộc
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            className="grid auto-rows-max items-start gap-4 md:gap-8"
            id="edit-employee-form"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="avatar"
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
                        ref={avatarInputRef}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setFile(file);
                            field.onChange("");
                          }
                        }}
                        className="hidden"
                      />
                      <button
                        className="flex aspect-square w-[100px] items-center justify-center rounded-md border border-dashed"
                        type="button"
                        onClick={() => avatarInputRef.current?.click()}
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
                      <Label htmlFor="name">Tên</Label>
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="email">Email</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input id="email" className="w-full" {...field} />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="role">Vai trò</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn vai trò" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {RoleValues.map((role) => {
                              if (role === Role.Guest) return null;
                              return (
                                <SelectItem key={role} value={role}>
                                  {role}
                                </SelectItem>
                              );
                            })}
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
                name="changePassword"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="email">Đổi mật khẩu</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              {changePassword && (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                        <Label htmlFor="password">Mật khẩu mới</Label>
                        <div className="col-span-3 w-full space-y-2">
                          <Input
                            id="password"
                            className="w-full"
                            type="password"
                            {...field}
                          />
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              )}
              {changePassword && (
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                        <Label htmlFor="confirmPassword">
                          Xác nhận mật khẩu mới
                        </Label>
                        <div className="col-span-3 w-full space-y-2">
                          <Input
                            id="confirmPassword"
                            className="w-full"
                            type="password"
                            {...field}
                          />
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              )}
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button type="submit" form="edit-employee-form">
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
