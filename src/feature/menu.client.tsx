"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { formatCurrency, getVietnameseDishStatus, getGuestTableLoginPath } from "@/lib/utils";
import envConfig from "@/lib/validateEnv";
import { DishStatus } from "@/type/constant";
import { useState, useEffect, useCallback, useMemo } from "react";
import { DishSchema, DishTypeValues } from "@/type/schema/dish.schema";
import z from "zod";
import { Funnel, ShoppingCart, Trash2, Plus, Minus, MapPin } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useGuestCreateOrderMutation } from "@/lib/query/useOrder";
import { toast } from "sonner";
import { Link } from "@/lib/i18n/navigation";
import SwitchLanguage from "@/components/ui/switch-language";
import ModeToggle from "@/components/ui/mode-toggle";

interface Dish {
  dishes: z.infer<typeof DishSchema>[];
}

export default function MenuClient(props: Dish) {
  const { dishes: initialDishes } = props;
  const [cart, setCart] = useState<Record<number, number>>({});
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [allDishes] = useState<z.infer<typeof DishSchema>[]>(initialDishes);

  const handleSelectType = (type: string | null) => {
    setSelectedType(type);
    setIsFilterOpen(false);
  };
  const { mutateAsync } = useGuestCreateOrderMutation();

  const filteredDishes = useMemo(() => {
    return allDishes.filter((dish) => {
      const matchesSearch = dish.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesType = selectedType === null || dish.type === selectedType;
      return matchesSearch && matchesType;
    });
  }, [allDishes, searchTerm, selectedType]);

  const updateQuantity = (dishId: number, delta: number) => {
    setCart((prev) => {
      const currentQuantity = prev[dishId] || 0;
      const newQuantity = Math.max(0, currentQuantity + delta);

      if (newQuantity === 0) {
        const { [dishId]: _, ...rest } = prev;
        return rest;
      }

      return { ...prev, [dishId]: newQuantity };
    });
  };

  const cartItems = Object.entries(cart)
    .map(([dishId, quantity]) => {
      const dish = allDishes.find((d) => d.id === Number(dishId));
      return dish ? { ...dish, quantity } : null;
    })
    .filter(Boolean) as (z.infer<typeof DishSchema> & { quantity: number })[];

  const totalRealPrice = cartItems.reduce(
    (sum, item) =>
      sum +
      (Number(item.basePrice) || Number(item.virtualPrice)) * item.quantity,
    0
  );

  const totalVirtualPrice = cartItems.reduce(
    (sum, item) =>
      sum + Number(item.virtualPrice || item.basePrice) * item.quantity,
    0
  );

  const discount = totalVirtualPrice - totalRealPrice;

  const handlePlaceOrder = async () => {
    try {
      const temp = cartItems.map((item) => ({
        dishId: item.id,
        quantity: item.quantity,
      }));
      await mutateAsync(temp);
      setCart({});
      toast.success("Đặt món thành công!");
    } catch (error) {
      toast.error("Đặt món thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
      {/* Header */}
      <div className="p-4 bg-white dark:bg-slate-900 flex justify-between items-center shadow-sm dark:shadow-slate-900/50 z-10 sticky top-0 transition-colors duration-300">
        <div>
          <Link href={getGuestTableLoginPath()}>
            <h1 className="text-xl font-extrabold text-gray-800 dark:text-slate-100 uppercase tracking-tight hover:text-orange-500 transition-colors">
              Quán nhà mộc
            </h1>
          </Link>
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

      <div className="container mx-auto py-8 flex-1 p-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Thực đơn nhà hàng</h1>
          <p className="text-lg text-muted-foreground">Chọn món bạn yêu thích</p>
        </div>

        <div className="sticky top-[80px] z-20 bg-background/95 backdrop-blur-sm py-4 mb-8 space-y-4 border-b">
        <div className="relative flex items-center justify-center gap-2">
          <Input
            placeholder="Tìm kiếm món ăn..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md mx-auto flex-grow"
          />

          <Drawer open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <DrawerTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Funnel className="h-4 w-4" />
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Bộ lọc</DrawerTitle>
              </DrawerHeader>
              <div className="p-4 space-y-2">
                <Button
                  variant={selectedType === null ? "default" : "outline"}
                  onClick={() => handleSelectType(null)}
                  className="w-full justify-start rounded-full"
                >
                  Tất cả
                </Button>
                {DishTypeValues.map((type) => (
                  <Button
                    key={type}
                    variant={selectedType === type ? "default" : "outline"}
                    onClick={() => handleSelectType(type)}
                    className="w-full justify-start rounded-full"
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </DrawerContent>
          </Drawer>

          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="hidden md:inline-flex"
              >
                <Funnel className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Bộ lọc</SheetTitle>
              </SheetHeader>
              <div className="py-4 space-y-2">
                <Button
                  variant={selectedType === null ? "default" : "outline"}
                  onClick={() => handleSelectType(null)}
                  className="w-full justify-start rounded-full"
                >
                  Tất cả
                </Button>
                {DishTypeValues.map((type) => (
                  <Button
                    key={type}
                    variant={selectedType === type ? "default" : "outline"}
                    onClick={() => handleSelectType(type)}
                    className="w-full justify-start rounded-full"
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          {cartItems.length > 0 && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <ShoppingCart className="h-4 w-4" />
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Giỏ hàng</SheetTitle>
                </SheetHeader>
                <div className="py-4 space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(
                            Number(item.basePrice) || Number(item.virtualPrice)
                          )}{" "}
                          x {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold">
                        {formatCurrency(
                          (Number(item.basePrice) ||
                            Number(item.virtualPrice)) * item.quantity
                        )}
                      </p>
                    </div>
                  ))}
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Tạm tính:</span>
                      <span>{formatCurrency(totalVirtualPrice)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Giảm giá:</span>
                        <span>-{formatCurrency(discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg">
                      <span>Tổng cộng:</span>
                      <span>{formatCurrency(totalRealPrice)}</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4" onClick={handlePlaceOrder}>
                    Đặt món
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>

        {/* Filter Controls (desktop and larger screens) */}
        <div className="flex flex-wrap justify-center gap-2 md:flex-row md:justify-start hidden md:flex">
          <Button
            variant={selectedType === null ? "default" : "outline"}
            onClick={() => setSelectedType(null)}
            className="rounded-full"
          >
            Tất cả
          </Button>
          {DishTypeValues.map((type) => (
            <Button
              key={type}
              variant={selectedType === type ? "default" : "outline"}
              onClick={() => setSelectedType(type)}
              className="rounded-full"
            >
              {type}
            </Button>
          ))}
        </div>
      </div>

      {filteredDishes && filteredDishes.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {filteredDishes.map((dish, index) => {
            const quantity = cart[dish.id] || 0;
            const uniqueKey = `${dish.id}-${index}`;
            return (
              <Card key={uniqueKey} className="flex flex-col">
                <CardHeader className="p-0">
                  <div className="relative">
                    <div className="w-full h-32 md:h-48 rounded-t-lg rounded-b-none relative">
                      <Image
                        src={`${envConfig.NEXT_PUBLIC_API_ENDPOINT}/static/dishes/${dish.image}`}
                        alt={dish.name}
                        fill
                        priority={index < 4}
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        placeholder="blur"
                        blurDataURL={`data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQ4IiB2aWV3Qm94PSIwIDAgNDAwIDQ4IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDgiIGZpbGw9IiM5OTkiLz48L3N2Zz4=`}
                      />
                      <div
                        className="absolute inset-0 flex items-center justify-center 
     bg-black/40 opacity-0 hover:opacity-100 transition 
     rounded-t-lg text-white text-sm"
                      >
                        {dish.name}
                      </div>
                    </div>
                    <Badge
                      className="absolute top-2 right-2"
                      variant={
                        dish.status === DishStatus.Available
                          ? "default"
                          : "secondary"
                      }
                    >
                      {getVietnameseDishStatus(dish.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow p-3 md:p-4">
                  <CardTitle className="text-sm md:text-lg line-clamp-2">{dish.name}</CardTitle>
                </CardContent>

                <div className="p-3 pt-0 md:p-4 md:pt-0 flex items-center justify-between">
                  <div className="flex flex-col">
                    <p className="text-sm md:text-lg font-bold text-primary">
                      {formatCurrency(
                        Number(dish.basePrice) || Number(dish.virtualPrice)
                      )}
                    </p>

                    {dish.basePrice &&
                      Number(dish.basePrice) !== Number(dish.virtualPrice) && (
                        <p className="text-xs md:text-sm text-muted-foreground line-through">
                          {formatCurrency(
                            Number(dish.virtualPrice || dish.basePrice)
                          )}
                        </p>
                      )}
                  </div>
                  <div className="shrink-0 ml-2">
                    {quantity === 0 ? (
                      <Button
                        size="icon"
                        className="h-8 w-8 rounded-full bg-orange-500 hover:bg-orange-600 text-white"
                        onClick={() => updateQuantity(dish.id, 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    ) : (
                      <div className="flex items-center gap-1 bg-muted/50 rounded-full p-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 rounded-full bg-background shadow-sm hover:bg-background/80"
                          onClick={() => updateQuantity(dish.id, -1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-4 text-center text-xs md:text-sm font-medium">{quantity}</span>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200"
                          onClick={() => updateQuantity(dish.id, 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-2">Chưa có món ăn nào</h2>
          <p className="text-muted-foreground">
            Vui lòng thử tìm kiếm khác hoặc quay lại sau
          </p>
        </div>
      )}

      {/* Bottom Cart Bar (Mobile) */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 md:hidden z-50">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">Tổng cộng:</span>
            <span className="font-bold">{formatCurrency(totalRealPrice)}</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Tạm tính: {formatCurrency(totalVirtualPrice)}</span>
            {discount > 0 && (
              <span className="text-green-600">
                Giảm: -{formatCurrency(discount)}
              </span>
            )}
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button className="w-full">
                Xem giỏ hàng (
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)})
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Giỏ hàng</SheetTitle>
              </SheetHeader>
              <div className="py-4 space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(
                          Number(item.basePrice) || Number(item.virtualPrice)
                        )}{" "}
                        x {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold">
                      {formatCurrency(
                        (Number(item.basePrice) || Number(item.virtualPrice)) *
                          item.quantity
                      )}
                    </p>
                  </div>
                ))}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Tạm tính:</span>
                    <span>{formatCurrency(totalVirtualPrice)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Giảm giá:</span>
                      <span>-{formatCurrency(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg">
                    <span>Tổng cộng:</span>
                    <span>{formatCurrency(totalRealPrice)}</span>
                  </div>
                </div>
                <Button className="w-full mt-4" onClick={handlePlaceOrder}>
                  Đặt món
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      )}
      </div>
    </div>
  );
}
