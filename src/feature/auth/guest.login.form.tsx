"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GuestLoginBody, GuestLoginBodyType } from "@/type/schema/guest.schema";
import { useLoginGuestMutation } from "@/lib/query/useAuth";
import { useRouter } from "@/lib/i18n/navigation";
import { useAppStore } from "@/lib/store/app.store";
import { generateSocketInstance } from "@/lib/utils";
import { useParams, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  MapPin,
  Pencil,
  ChevronRight,
  ReceiptText,
  Users,
  Star,
  ShoppingBag,
  Sun,
  Sunrise,
  Moon,
  Speaker,
} from "lucide-react";
import { useState, useEffect } from "react";
import SwitchLanguage from "@/components/ui/switch-language";
import ModeToggle from "@/components/ui/mode-toggle";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function GuestLoginForm() {
  const params = useParams<{ number: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const tableNumber = params.number ? parseInt(params.number, 10) : 1;
  const loginGuestMutation = useLoginGuestMutation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [greeting, setGreeting] = useState("Good afternoon");
  const [GreetingIcon, setGreetingIcon] = useState<any>(Sun);

  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      setGreeting("Good morning");
      setGreetingIcon(() => Sunrise);
    } else if (currentHour < 18) {
      setGreeting("Good afternoon");
      setGreetingIcon(() => Sun);
    } else {
      setGreeting("Good evening");
      setGreetingIcon(() => Moon);
    }
  }, []);

  const form = useForm<GuestLoginBodyType>({
    resolver: zodResolver(GuestLoginBody),
    defaultValues: {
      name: "Customers",
      phone: "",
      token: token || "",
      tableNumber: tableNumber,
    },
  });

  const nameValue = form.watch("name");

  const setRole = useAppStore((state) => state.setRole);
  const setSocket = useAppStore((state) => state.setSocket);
  const onSubmit = async (values: GuestLoginBodyType) => {
    try {
      // Remove phone to prevent strict backend validation failure
      const payload = { ...values };
      delete payload.phone;

      const res = await loginGuestMutation.mutateAsync(payload);
      setRole(res.payload.data.guest.role);
      const socketInstance = await setSocket(
        generateSocketInstance(res.payload.data.accessToken)
      );
      router.push(`/menu`);
    } catch (error) {
      toast.error("Đăng nhập thất bại. Vui lòng liên hệ nhân viên phục vụ.");
      console.error("Login failed:", error);
    }
  };

  const handleFeatureClick = () => {
    toast.info("Tính năng đang phát triển", {
      description: "Tính năng này sẽ sớm ra mắt trong các phiên bản tiếp theo.",
    });
  };

  return (
    <div className="fixed inset-0 z-50 w-full min-h-screen overflow-y-auto bg-gray-50 dark:bg-slate-950 flex flex-col font-sans transition-colors duration-300">
      {/* Header */}
      <div className="p-4 bg-white dark:bg-slate-900 flex justify-between items-center shadow-sm dark:shadow-slate-900/50 z-10 sticky top-0 transition-colors duration-300">
        <div>
          <h1 className="text-xl font-extrabold text-gray-800 dark:text-slate-100 uppercase tracking-tight">
            Quán nhà mộc
          </h1>
          <div className="flex items-center text-xs text-gray-500 dark:text-slate-400 mt-1 max-w-[250px]">
            <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
            <span className="truncate">
              26H1 Ngõ 130 Xuân Thuỷ Cầu Giấy, Phường...
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <SwitchLanguage compact className="h-10 rounded-full bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-inner px-3 text-slate-800 dark:text-slate-200 w-[70px] focus:ring-0 focus:ring-offset-0" />
          <ModeToggle />
        </div>
      </div>

      <div className="flex-1 p-4 flex flex-col gap-5 overflow-y-auto pb-24">
        {/* Banner coded in HTML/CSS */}
        <div className="w-full rounded-2xl overflow-hidden shadow-sm relative min-h-[160px] bg-gradient-to-r from-orange-400 via-orange-400 to-yellow-400 flex">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl transform translate-x-10 -translate-y-10 pointer-events-none"></div>
          <div className="absolute bottom-0 right-20 w-24 h-24 bg-yellow-300/40 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="flex-1 p-5 flex flex-col justify-center relative z-10">
            <div className="inline-block bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider w-max mb-1 border border-white/30">
              IPOS O2O
            </div>
            <h2 className="text-2xl font-extrabold text-white leading-tight drop-shadow-md mb-1" style={{ textShadow: '1px 2px 4px rgba(0,0,0,0.15)' }}>
              MENU ĐIỆN TỬ
            </h2>
            <p className="text-white text-xs font-medium leading-relaxed max-w-[180px] opacity-95">
              “Gọi món”, “gọi nhân viên” trên chính điện thoại của bạn
            </p>
          </div>

          <div className="w-[120px] relative z-10 flex items-center justify-center">
            {/* Mock phone / food illustration using CSS & Emojis */}
            <div className="relative w-16 h-24 bg-gray-900 dark:bg-slate-900 rounded-xl border-2 border-gray-800 dark:border-slate-800 shadow-xl flex items-center justify-center transform rotate-6 hover:rotate-0 transition-transform">
              <div className="absolute top-1 w-6 h-1 bg-gray-800 dark:bg-slate-700 rounded-full"></div>
              <div className="w-[90%] h-[90%] bg-white dark:bg-slate-800 rounded-lg p-1 flex flex-col gap-1 overflow-hidden">
                <div className="w-full h-8 bg-orange-100 dark:bg-orange-900/40 rounded text-center text-[10px] flex items-center justify-center border border-orange-200 dark:border-orange-800/50">
                  🥩
                </div>
                <div className="w-full h-6 bg-amber-50 dark:bg-amber-900/30 rounded flex items-center justify-center text-[8px] border border-amber-100 dark:border-amber-800/50">
                  🧋
                </div>
              </div>
            </div>
            {/* Floating elements */}
            <div className="absolute -top-2 right-2 bg-yellow-100 dark:bg-yellow-900/80 text-orange-600 dark:text-orange-300 text-[8px] font-bold px-2 py-1 rounded-full shadow-md border border-yellow-200 dark:border-yellow-700 transform rotate-12">
              Quét QRCode<br/>tại bàn
            </div>
            <div className="absolute bottom-2 -left-4 text-2xl drop-shadow-lg">
              🌶️
            </div>
          </div>
        </div>

        {/* Greeting Area */}
        <div className="flex flex-col items-center justify-center pt-2">
          <div className="w-6 h-1 bg-gray-300 dark:bg-slate-700 rounded-full mb-3" />
          <div className="flex items-center text-lg font-semibold text-gray-800 dark:text-slate-100 gap-2">
            <GreetingIcon className="w-6 h-6 text-yellow-500" />
            <span>
              {greeting} <span className="text-blue-600 dark:text-blue-400">{nameValue}</span>
            </span>
            <button onClick={() => setIsDialogOpen(true)} className="p-1 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">
              <Pencil className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </button>
          </div>
          <div className="text-sm text-gray-600 dark:text-slate-400 mt-1 flex items-center">
            We will return your items to you at the table:
            <span className="ml-2 font-bold px-3 py-1 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-full shadow-sm text-gray-800 dark:text-slate-200">
              {tableNumber < 10 ? `A0${tableNumber}` : `A${tableNumber}`}
            </span>
          </div>
        </div>

        {/* Accumulate Points Banner */}
        <button 
          type="button" 
          onClick={() => setIsDialogOpen(true)}
          className="w-full relative overflow-hidden bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-950/60 dark:to-blue-900/40 rounded-xl p-4 shadow-sm border border-blue-100 dark:border-blue-900/50 flex items-center group transition-all hover:shadow-md"
        >
          <div className="bg-blue-200/50 dark:bg-blue-800/40 p-3 rounded-lg mr-4">
            <ShoppingBag className="w-8 h-8 text-blue-500 dark:text-blue-400" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-semibold text-blue-700 dark:text-blue-300 pr-4">
              Enter phone number to accumulate points
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-blue-500 dark:text-blue-400 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Features Grid */}
        <div className="grid grid-cols-3 gap-3">
          <button 
            type="button" 
            onClick={handleFeatureClick}
            className="bg-gradient-to-b from-rose-50 to-white dark:from-rose-950/40 dark:to-slate-900 rounded-xl p-3 shadow-sm border border-rose-100 dark:border-rose-900/30 flex flex-col items-center justify-center gap-2 hover:shadow-md transition-shadow relative overflow-hidden min-h-[100px]"
          >
            <span className="text-xs font-semibold text-gray-800 dark:text-slate-200 text-center relative z-10">Request bill</span>
            <ReceiptText className="w-10 h-10 text-rose-400 dark:text-rose-500 mt-1 relative z-10" />
            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-rose-100 dark:bg-rose-900/20 rounded-full opacity-50"></div>
          </button>
          <button 
            type="button" 
            onClick={handleFeatureClick}
            className="bg-gradient-to-b from-teal-50 to-white dark:from-teal-950/40 dark:to-slate-900 rounded-xl p-3 shadow-sm border border-teal-100 dark:border-teal-900/30 flex flex-col items-center justify-center gap-2 hover:shadow-md transition-shadow relative overflow-hidden min-h-[100px]"
          >
            <span className="text-xs font-semibold text-gray-800 dark:text-slate-200 text-center relative z-10">Ask for service</span>
            <Users className="w-10 h-10 text-teal-500 dark:text-teal-400 mt-1 relative z-10" />
            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-teal-100 dark:bg-teal-900/20 rounded-full opacity-50"></div>
          </button>
          <button 
            type="button" 
            onClick={handleFeatureClick}
            className="bg-gradient-to-b from-amber-50 to-white dark:from-amber-950/40 dark:to-slate-900 rounded-xl p-3 shadow-sm border border-amber-100 dark:border-amber-900/30 flex flex-col items-center justify-center gap-2 hover:shadow-md transition-shadow relative overflow-hidden min-h-[100px]"
          >
            <span className="text-xs font-semibold text-gray-800 dark:text-slate-200 text-center relative z-10">Give feedback</span>
            <Star className="w-10 h-10 text-amber-400 dark:text-amber-500 mt-1 relative z-10 fill-amber-400 dark:fill-amber-500" />
            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-amber-100 dark:bg-amber-900/20 rounded-full opacity-50"></div>
          </button>
        </div>

        {/* View Menu CTA */}
        <Button
          onClick={form.handleSubmit(onSubmit)}
          disabled={loginGuestMutation.isPending}
          className="w-full bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-400 hover:from-orange-600 hover:to-yellow-500 dark:from-orange-600 dark:via-orange-500 dark:to-yellow-500 text-white font-bold text-lg py-8 rounded-xl shadow-lg border-b-4 border-orange-600 dark:border-orange-700 hover:border-orange-700 dark:hover:border-orange-800 hover:translate-y-[2px] transition-all flex items-center justify-between px-6 relative overflow-hidden group"
        >
          <span className="relative z-10">
            {loginGuestMutation.isPending ? "Đang xử lý..." : "View Menu - Order food"}
          </span>
          <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center relative z-10 backdrop-blur-sm">
            <ChevronRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
          </div>
          {/* Decorative book icon in background */}
          <div className="absolute -right-4 -bottom-4 opacity-30 transform -rotate-12 scale-150">
            <ReceiptText className="w-24 h-24 text-white" />
          </div>
        </Button>
      </div>

      {/* Footer */}
      <div className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-md p-4 text-center text-xs text-gray-500 dark:text-slate-400 flex flex-col items-center justify-center border-t border-gray-200 dark:border-slate-800 sticky bottom-0 w-full z-10 mt-auto transition-colors duration-300">
        <span>Powered by <strong className="text-gray-700 dark:text-slate-300 text-sm">iPOS.vn</strong></span>
      </div>
      
      {/* Floating Action Button */}
      <div className="fixed bottom-20 right-4 z-20">
        <button 
          onClick={handleFeatureClick}
          className="w-14 h-14 bg-orange-100 dark:bg-orange-950/80 rounded-full shadow-lg flex items-center justify-center border-2 border-orange-200 dark:border-orange-800/50 hover:scale-105 transition-transform"
        >
          <Speaker className="w-6 h-6 text-orange-600 dark:text-orange-400 transform -rotate-12" />
        </button>
      </div>

      {/* Dialog Login form */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] dark:bg-slate-900 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-center text-xl text-orange-600 dark:text-orange-500">Đăng nhập với Guest</DialogTitle>
            <DialogDescription className="text-center text-gray-600 dark:text-slate-400 pt-2">
              Nhập số điện thoại để tích điểm và nhận ưu đãi dành cho hội viên
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={(e) => { e.preventDefault(); setIsDialogOpen(false); }} className="space-y-4 pt-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <Label className="dark:text-slate-200">Tên hiển thị</Label>
                    <Input {...field} placeholder="VD: Khách hàng 1" className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100" />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <Label className="dark:text-slate-200">Số điện thoại</Label>
                    <Input {...field} placeholder="VD: 0987654321" type="tel" className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100" />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="pt-4 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">Đóng</Button>
                <Button type="submit" onClick={() => setIsDialogOpen(false)} className="bg-orange-500 hover:bg-orange-600 dark:text-white">Lưu thông tin</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
