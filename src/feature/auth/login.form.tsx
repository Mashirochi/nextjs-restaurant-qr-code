"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginBody, LoginBodyType } from "@/type/schema/auth.schema";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Eye, EyeOff, Link } from "lucide-react";
import clsx from "clsx";
import { useLoginMutation } from "@/lib/query/useAuth";
import {
  generateSocketInstance,
  getOauthGoogleUrl,
  handleErrorApi,
} from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store/app.store";

export default function LoginForm() {
  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const loginMutation = useLoginMutation();
  const setSocket = useAppStore((state) => state.setSocket);
  const setRole = useAppStore((state) => state.setRole);
  const setUser = useAppStore((state) => state.setUser);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const onSubmit = async (data: LoginBodyType) => {
    if (loginMutation.isPending) return;
    try {
      const res = await loginMutation.mutateAsync(data);
      if (res?.payload?.message) {
        const { account, accessToken } = res.payload.data;
        setUser({
          id: account.id,
          name: account.name,
          email: account.email,
        });

        setRole(account.role);

        // Set socket instance with the access token
        setSocket(generateSocketInstance(accessToken));

        router.replace("/manage/dashboard");
        toast("Login succeed", {
          description: res.payload.message,
          duration: 5000,
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
        });
      }
    } catch (error) {
      console.error(error);
      handleErrorApi({
        error,
        setError: form.setError,
      });
    }
  };

  const ggOauthUrl = getOauthGoogleUrl();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm shadow-md border border-border bg-card text-card-foreground transition-colors">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Đăng nhập</CardTitle>
          <CardDescription className="text-center">
            Nhập email và mật khẩu của bạn để đăng nhập vào hệ thống
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              className="space-y-4"
              noValidate
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      {...field}
                      tabIndex={1}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center mb-1">
                      <Label htmlFor="password">Mật khẩu</Label>
                      <Button
                        variant="link"
                        size="sm"
                        className="p-0 text-primary hover:underline"
                        type="button"
                        onClick={() => alert("Đi tới trang quên mật khẩu")}
                        tabIndex={5}
                      >
                        Quên mật khẩu?
                      </Button>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        required
                        {...field}
                        tabIndex={2}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={clsx(
                          "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-transform duration-300",
                          "scale-100"
                        )}
                      >
                        {showPassword ? (
                          <EyeOff
                            tabIndex={6}
                            className="w-5 h-5 transform transition-transform duration-300"
                          />
                        ) : (
                          <Eye
                            tabIndex={6}
                            className="w-5 h-5 transform transition-transform duration-300"
                          />
                        )}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                tabIndex={3}
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                type="button"
                tabIndex={4}
                onClick={() => router.push(ggOauthUrl)}
              >
                Đăng nhập bằng Google
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
