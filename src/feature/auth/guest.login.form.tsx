"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GuestLoginBody, GuestLoginBodyType } from "@/type/schema/guest.schema";
import { useLoginGuestMutation } from "@/lib/query/useAuth";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAppStore } from "@/lib/store/app.store";
import { generateSocketInstance } from "@/lib/utils";

export default function GuestLoginForm() {
  const params = useParams<{ number: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const tableNumber = params.number ? parseInt(params.number, 10) : 1;
  const loginGuestMutation = useLoginGuestMutation();
  const form = useForm<GuestLoginBodyType>({
    resolver: zodResolver(GuestLoginBody),
    defaultValues: {
      name: "",
      token: token || "",
      tableNumber: tableNumber,
    },
  });
  const setRole = useAppStore((state) => state.setRole);
  const setSocket = useAppStore((state) => state.setSocket);
  const onSubmit = async (values: GuestLoginBodyType) => {
    try {
      const res = await loginGuestMutation.mutateAsync(values);
      setRole(res.payload.data.guest.role);
      const socketInstance = await setSocket(
        generateSocketInstance(res.payload.data.accessToken)
      );
      router.push(`/menu`);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Gọi món</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="space-y-2 max-w-[600px] flex-shrink-0 w-full"
            noValidate
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-2">
                      <Label htmlFor="name">Tên khách hàng</Label>
                      <Input id="name" type="text" required {...field} />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tableNumber"
                render={({ field }) => <Input type="hidden" {...field} />}
              />
              <FormField
                control={form.control}
                name="token"
                render={({ field }) => <Input type="hidden" {...field} />}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={loginGuestMutation.isPending}
              >
                {loginGuestMutation.isPending
                  ? "Đang đăng nhập..."
                  : "Đăng nhập"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
