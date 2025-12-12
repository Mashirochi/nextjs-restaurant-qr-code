"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import {
  ChangePasswordBody,
  ChangePasswordBodyType,
} from "@/type/schema/account.schema";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useChangePasswordMutation } from "@/lib/query/useAccount";
import { handleErrorApi } from "@/lib/utils";
import { toast } from "sonner";

export default function ChangePasswordForm() {
  const form = useForm<ChangePasswordBodyType>({
    resolver: zodResolver(ChangePasswordBody),
    defaultValues: {
      oldPassword: "",
      password: "",
      confirmPassword: "",
    },
  });

  const changePasswordMutation = useChangePasswordMutation();

  const onSubmit = async (values: ChangePasswordBodyType) => {
    if (changePasswordMutation.isPending) return;
    try {
      const result = await changePasswordMutation.mutateAsync(values);
      toast.success("Đổi mật khẩu thành công", {
        description: result.payload.message,
        classNames: {
          toast: "bg-green-100 border-green-200",
          title: "text-green-800",
          description: "text-green-600",
        },
      });
      form.reset();
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError,
      });
    }
  };

  const isLoading = changePasswordMutation.isPending;

  return (
    <Form {...form}>
      <form
        noValidate
        className="grid auto-rows-max items-start gap-4 md:gap-8"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Card className="overflow-hidden" x-chunk="dashboard-07-chunk-4">
          <CardHeader>
            <CardTitle>Đổi mật khẩu</CardTitle>
            <VisuallyHidden>
              <CardDescription>Change Password</CardDescription>
            </VisuallyHidden>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <FormField
                control={form.control}
                name="oldPassword"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-3">
                      <Label htmlFor="oldPassword">Mật khẩu cũ</Label>
                      <Input
                        id="oldPassword"
                        type="password"
                        className="w-full"
                        {...field}
                        disabled={isLoading}
                      />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-3">
                      <Label htmlFor="password">Mật khẩu mới</Label>
                      <Input
                        id="password"
                        type="password"
                        className="w-full"
                        {...field}
                        disabled={isLoading}
                      />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-3">
                      <Label htmlFor="confirmPassword">
                        Nhập lại mật khẩu mới
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        className="w-full"
                        {...field}
                        disabled={isLoading}
                      />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <div className=" items-center gap-2 md:ml-auto flex">
                <Button
                  variant="outline"
                  size="sm"
                  type="reset"
                  disabled={isLoading}
                >
                  Hủy
                </Button>
                <Button size="sm" type="submit" disabled={isLoading}>
                  {isLoading ? "Đang đổi mật khẩu..." : "Lưu thông tin"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
