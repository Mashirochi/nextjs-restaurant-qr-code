"use client";
import { Badge } from "@/components/ui/badge";
import ChangePasswordForm from "@/feature/manage/setting/change.password.form";
import UpdateProfileForm from "@/feature/manage/setting/update.profile.form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

export default function Setting() {
  const [activeTab, setActiveTab] = useState<
    "profile" | "password" | "payment"
  >("profile");

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-6xl flex-1 auto-rows-max gap-4">
        <div className="flex items-center gap-4">
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            Cài đặt
          </h1>
          <Badge variant="outline" className="ml-auto sm:ml-0">
            Owner
          </Badge>
        </div>

        <div className="grid gap-4 md:gap-8 mt-6">
          <Card>
            <CardContent className="p-0">
              <div className="border-b">
                <div className="flex flex-wrap -mb-px ">
                  <Button
                    variant={activeTab === "profile" ? "default" : "ghost"}
                    className="w-full justify-start rounded-none border-b-2 border-transparent rounded-t-lg px-4 py-2 font-medium transition-all hover:border-gray-300 data-[state=active]:border-primary data-[state=active]:text-primary md:w-auto md:justify-center"
                    onClick={() => setActiveTab("profile")}
                  >
                    Thông tin tài khoản
                  </Button>
                  <Button
                    variant={activeTab === "password" ? "default" : "ghost"}
                    className="w-full justify-start rounded-none border-b-2 border-transparent px-4 py-2 font-medium transition-all hover:border-gray-300 data-[state=active]:border-primary data-[state=active]:text-primary md:w-auto md:justify-center"
                    onClick={() => setActiveTab("password")}
                  >
                    Đổi mật khẩu
                  </Button>
                  <Button
                    variant={activeTab === "payment" ? "default" : "ghost"}
                    className="w-full justify-start rounded-none border-b-2 border-transparent px-4 py-2 font-medium transition-all hover:border-gray-300 data-[state=active]:border-primary data-[state=active]:text-primary md:w-auto md:justify-center"
                    onClick={() => setActiveTab("payment")}
                  >
                    Lịch sử thanh toán
                  </Button>
                </div>
              </div>

              <div className="p-6">
                {activeTab === "profile" && <UpdateProfileForm />}
                {activeTab === "password" && <ChangePasswordForm />}
                {activeTab === "payment" && (
                  <div className="flex h-32 items-center justify-center">
                    <p className="text-sm text-muted-foreground">
                      Lịch sử thanh toán sẽ được hiển thị ở đây
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
