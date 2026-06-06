"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GuestLoginBody, GuestLoginBodyType } from "@/type/schema/guest.schema";
import { useLoginGuestMutation, useGetGuestTableStatus, useUpdateGuestTableMutation } from "@/lib/query/useAuth";
import { Link, useRouter } from "@/lib/i18n/navigation";
import { useAppStore } from "@/lib/store/app.store";
import { generateSocketInstance, setGuestTableTokenToLocalStorage, setGuestTableNumberToLocalStorage } from "@/lib/utils";
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
  CreditCard,
  ShoppingCart,
  HandHelping,
  Trash2,
  MessageSquare,
  Send,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
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
import ReviewDialog from "@/components/review/review-dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import "./guest.login.form.css";

const bannerItems = [
  {
    id: 1,
    title: "MENU ĐIỆN TỬ",
    tag: "IPOS O2O",
    description: "“Gọi món”, “gọi nhân viên” trên chính điện thoại của bạn",
    image: "/banner/digital_menu_banner.png",
    cta: "Xem Menu",
    bgClass: "from-orange-400 via-orange-400 to-yellow-400",
  },
  {
    id: 2,
    title: "GỌI NHÂN VIÊN DỄ DÀNG",
    tag: "TIỆN LỢI",
    description: "Chỉ với 1 chạm, nhân viên sẽ có mặt ngay lập tức",
    image: "/banner/call_banner.png",
    cta: "Thử ngay",
    bgClass: "from-blue-400 via-blue-500 to-cyan-400",
  },
  {
    id: 3,
    title: "KHÔNG GIAN SANG TRỌNG",
    tag: "TRẢI NGHIỆM",
    description: "Thưởng thức ẩm thực trong không gian tuyệt vời",
    image: "/banner/inside_banner.png",
    cta: "Khám phá",
    bgClass: "from-emerald-400 via-emerald-500 to-teal-400",
  },
];

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
  const [reviewOpen, setReviewOpen] = useState<boolean>(false)
  const [api, setApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideCount, setSlideCount] = useState(0);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [selectedServiceOption, setSelectedServiceOption] = useState<string | null>(null);
  const [serviceMessage, setServiceMessage] = useState("");

  const updateTableMutation = useUpdateGuestTableMutation();
  const fallbackToken = token || "b926fa73-6ad6-437d-b69c-b1da736cecf4";
  const { data: tableStatusData } = useGetGuestTableStatus(fallbackToken);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setGuestTableTokenToLocalStorage(fallbackToken);
      setGuestTableNumberToLocalStorage(tableNumber.toString());
    }
  }, [fallbackToken, tableNumber]);

  useEffect(() => {
    if (!api) {
      return;
    }

    setSlideCount(api.scrollSnapList().length);
    setCurrentSlide(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrentSlide(api.selectedScrollSnap() + 1);
    });
  }, [api]);

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
      token: fallbackToken,
      tableNumber: tableNumber,
    },
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedName = localStorage.getItem("guest-name");
      if (savedName) {
        form.setValue("name", savedName);
      }
    }
  }, [form]);

  useEffect(() => {
    if (tableStatusData) {
      const phoneNumber = tableStatusData.payload.data.phoneNumber;
      if (phoneNumber) {
        form.setValue("phone", phoneNumber);
      } 
    }
  }, [tableStatusData, form]);

  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentName = form.getValues("name");
    const currentPhone = form.getValues("phone");

    if (typeof window !== "undefined") {
      localStorage.setItem("guest-name", currentName);
    }

    if (currentPhone) {
      try {
        await updateTableMutation.mutateAsync({
          token: fallbackToken,
          body: {
            phoneNumber: currentPhone,
          },
        });
        toast.success("Cập nhật số điện thoại tích điểm thành công!");
      } catch (error: any) {
        toast.error(error?.payload?.message || "Cập nhật số điện thoại tích điểm thất bại.");
      }
    }
    setIsDialogOpen(false);
  };

  const nameValue = form.watch("name");

  const socket = useAppStore((state) => state.socket);
  const isAuth = useAppStore((state) => state.isAuth);
  const setRole = useAppStore((state) => state.setRole);
  const setSocket = useAppStore((state) => state.setSocket);

  const onSubmit = async (values: GuestLoginBodyType) => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("guest-name", values.name);
      }

      // Already logged in — just navigate to menu without re-login
      if (isAuth && socket?.connected) {
        router.push(`/menu`);
        return;
      }

      const payload: any = {
        name: values.name,
        tableNumber: values.tableNumber,
        token: values.token,
      };
      if (values.phone) {
        payload.phoneNumber = values.phone;
      }

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

  const handleSendNotification = async (message: string) => {
    try {
      let currentSocket = socket;
      if (!currentSocket?.connected) {
        const payload: any = {
          name: form.getValues("name"),
          tableNumber: form.getValues("tableNumber"),
          token: form.getValues("token"),
        };
        const phoneVal = form.getValues("phone");
        if (phoneVal) {
          payload.phoneNumber = phoneVal;
        }
        const res = await loginGuestMutation.mutateAsync(payload);
        setRole(res.payload.data.guest.role);
        currentSocket = generateSocketInstance(res.payload.data.accessToken);
        setSocket(currentSocket);
      }
      
      currentSocket?.emit("create-notification", {
        table: form.getValues('tableNumber'),
        message
      });
      
      toast.success("Đã gửi yêu cầu đến nhân viên thành công!");
    } catch (error) {
      toast.error("Không thể gửi yêu cầu. Vui lòng thử lại.");
    }
  };

  const handleFeatureClick = () => {
    toast.info("Tính năng đang phát triển", {
      description: "Tính năng này sẽ sớm ra mắt trong các phiên bản tiếp theo.",
    });
  };

  return (
    <> 
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
        {/* Banner Carousel */}
        <Carousel
          opts={{ loop: true }}
          plugins={[
            Autoplay({
              delay: 4000,
              stopOnInteraction: true,
            }),
          ]}
          setApi={setApi}
          className="w-full relative"
        >
          <CarouselContent>
            {bannerItems.map((item) => (
              <CarouselItem key={item.id}>
                <div className="w-full rounded-2xl overflow-hidden shadow-sm relative h-[180px] sm:h-[220px] md:h-[280px]">
                  <Image
                    src={item.image}
                    alt={item.title || "Banner"}
                    fill
                    className="object-cover w-full h-full"
                    priority={item.id === 1}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 h-8 w-8 border bg-white/90 backdrop-blur-sm shadow-md text-gray-800 hover:bg-white" />
          <CarouselNext className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 h-8 w-8 border bg-white/90 backdrop-blur-sm shadow-md text-gray-800 hover:bg-white" />

          {/* Pagination Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1.5 z-20">
            {Array.from({ length: slideCount }).map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentSlide === index + 1 ? "w-4 bg-white" : "w-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        </Carousel>

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
                {tableNumber}
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
            onClick={() => setPaymentDialogOpen(true)}
            className="bg-gradient-to-b from-rose-50 to-white dark:from-rose-950/40 dark:to-slate-900 rounded-xl p-3 shadow-sm border border-rose-100 dark:border-rose-900/30 flex flex-col items-center justify-center gap-2 hover:shadow-md transition-shadow relative overflow-hidden min-h-[100px]"
          >
            <span className="text-xs font-semibold text-gray-800 dark:text-slate-200 text-center relative z-10">Request bill</span>
            <ReceiptText className="w-10 h-10 text-rose-400 dark:text-rose-500 mt-1 relative z-10" />
            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-rose-100 dark:bg-rose-900/20 rounded-full opacity-50"></div>
          </button>
          <button 
            type="button" 
            onClick={() => {
              setSelectedServiceOption(null);
              setServiceMessage("");
              setServiceDialogOpen(true);
            }}
            className="bg-gradient-to-b from-teal-50 to-white dark:from-teal-950/40 dark:to-slate-900 rounded-xl p-3 shadow-sm border border-teal-100 dark:border-teal-900/30 flex flex-col items-center justify-center gap-2 hover:shadow-md transition-shadow relative overflow-hidden min-h-[100px]"
          >
            <span className="text-xs font-semibold text-gray-800 dark:text-slate-200 text-center relative z-10">Ask for service</span>
            <Users className="w-10 h-10 text-teal-500 dark:text-teal-400 mt-1 relative z-10" />
            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-teal-100 dark:bg-teal-900/20 rounded-full opacity-50"></div>
          </button>
          <button 
            type="button" 
            onClick={() => setReviewOpen(true)}
            className="bg-gradient-to-b from-amber-50 to-white dark:from-amber-950/40 dark:to-slate-900 rounded-xl p-3 shadow-sm border border-amber-100 dark:border-amber-900/30 flex flex-col items-center justify-center gap-2 hover:shadow-md transition-shadow relative overflow-hidden min-h-[100px]"
          >
            <span  className="text-xs font-semibold text-gray-800 dark:text-slate-200 text-center relative z-10">Give feedback</span>
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
        <span>Powered by <strong className="text-gray-700 dark:text-slate-300 text-sm">quannhamoc.com</strong></span>
      </div>
      
      {/* Floating Action Button */}
      <Link href={"/orders"} prefetch={true}>
     <div className="fixed bottom-20 right-4 z-20">
  <button
    className="w-14 h-14 bg-orange-100 dark:bg-orange-950/80 rounded-full shadow-lg flex items-center justify-center border-2 border-orange-200 dark:border-orange-800/50 hover:scale-105 transition-transform"
  >
    <ShoppingCart
      className="w-6 h-6 text-orange-600 dark:text-orange-400 animate-cart-shake"
    />
  </button>
</div>
          </Link>
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
            <form onSubmit={handleSaveInfo} className="space-y-4 pt-4">
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
          <ReviewDialog 
        open={reviewOpen}
        onOpenChange={setReviewOpen}
      />

      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="sm:max-w-[425px] dark:bg-slate-900 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Chọn phương thức thanh toán</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <Button
              variant="outline"
              className="h-16 text-lg justify-start px-6 gap-4 border-2 hover:border-orange-500 hover:text-orange-600 transition-colors"
              onClick={() => {
                handleSendNotification("Khách muốn thanh toán bằng tiền mặt");
                setPaymentDialogOpen(false);
              }}
            >
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <ReceiptText className="w-5 h-5 text-orange-600" />
              </div>
              Thanh toán bằng tiền mặt
            </Button>
            <Button
              variant="outline"
              className="h-16 text-lg justify-start px-6 gap-4 border-2 hover:border-blue-500 hover:text-blue-600 transition-colors"
              onClick={() => {
                handleSendNotification("Khách muốn thanh toán bằng chuyển khoản ngân hàng");
                setPaymentDialogOpen(false);
              }}
            >
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-blue-600" />
              </div>
              Chuyển khoản ngân hàng
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Service Request Dialog */}
      <Dialog open={serviceDialogOpen} onOpenChange={setServiceDialogOpen}>
        <DialogContent className="sm:max-w-[425px] dark:bg-slate-900 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <HandHelping className="h-5 w-5 text-teal-500" />
              Gọi phục vụ
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-slate-400">
              Chọn nội dung yêu cầu hoặc nhập tin nhắn tùy chỉnh
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            {/* Predefined options */}
            <div className="flex flex-col gap-2">
              {[
                { label: "Khách cần gặp nhân viên phục vụ", icon: Users },
                { label: "Yêu cầu dọn bàn", icon: Trash2 },
              ].map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() =>
                    setSelectedServiceOption(
                      selectedServiceOption === opt.label ? null : opt.label
                    )
                  }
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 text-left transition-all text-sm font-medium ${
                    selectedServiceOption === opt.label
                      ? "border-teal-500 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300"
                      : "border-gray-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-700 text-gray-700 dark:text-slate-300"
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-full ${
                      selectedServiceOption === opt.label
                        ? "bg-teal-100 dark:bg-teal-800/50"
                        : "bg-gray-100 dark:bg-slate-800"
                    }`}
                  >
                    <opt.icon className={`h-4 w-4 ${
                      selectedServiceOption === opt.label
                        ? "text-teal-600 dark:text-teal-400"
                        : "text-gray-500 dark:text-slate-400"
                    }`} />
                  </div>
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Optional custom message */}
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-slate-300 flex items-center gap-1.5 mb-1.5">
                <MessageSquare className="h-3.5 w-3.5" />
                Tin nhắn thêm (tuỳ chọn)
              </Label>
              <Textarea
                placeholder="VD: Cho xin thêm đá, khăn giấy..."
                value={serviceMessage}
                onChange={(e) => setServiceMessage(e.target.value)}
                className="resize-none dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                rows={2}
              />
            </div>

            {/* Submit */}
            <Button
              disabled={!selectedServiceOption && !serviceMessage.trim()}
              className="w-full bg-teal-600 hover:bg-teal-700 dark:text-white gap-2"
              onClick={() => {
                const parts: string[] = [];
                if (selectedServiceOption) parts.push(selectedServiceOption);
                if (serviceMessage.trim()) parts.push(serviceMessage.trim());
                const message = parts.join(" - ");
                handleSendNotification(message);
                setServiceDialogOpen(false);
              }}
            >
              <Send className="h-4 w-4" />
              Gửi yêu cầu
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
   
  );
}
