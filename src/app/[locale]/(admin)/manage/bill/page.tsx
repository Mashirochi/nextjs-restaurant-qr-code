import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import BillTable from "@/feature/manage/bill/bill-table";
import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";

export async function generateMetadata() {
  return {
    title: "Quản lý Hóa đơn",
    description: "Xem và thanh toán hóa đơn của khách hàng",
  };
}

export default async function BillPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="space-y-2">
        <Card>
          <CardHeader>
            <CardTitle>Hóa đơn</CardTitle>
            <CardDescription>
              Danh sách hóa đơn theo từng khách hàng. Bấm "Thanh toán" để xử
              lý thanh toán bằng tiền mặt hoặc chuyển khoản.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense>
              <BillTable />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
