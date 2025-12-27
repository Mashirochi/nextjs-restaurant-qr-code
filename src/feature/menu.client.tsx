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
import { formatCurrency, getVietnameseDishStatus } from "@/lib/utils";
import envConfig from "@/lib/validateEnv";
import { DishStatus } from "@/type/constant";
import { useState, useEffect, useCallback, useMemo } from "react";
import { DishSchema, DishTypeValues } from "@/type/schema/dish.schema";
import z from "zod";
import { Funnel, ShoppingCart, Trash2 } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useGuestCreateOrderMutation } from "@/lib/query/useOrder";
import { toast } from "sonner";

interface Dish {
  dishes: z.infer<typeof DishSchema>[];
}

export default function MenuClient(props: Dish) {
  const { dishes: initialDishes } = props;
  const [cart, setCart] = useState<Record<number, number>>({});
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [allDishes] = useState<z.infer<typeof DishSchema>[]>(initialDishes);
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
      console.log("Transformed order items:", temp);
      await mutateAsync(temp);
      setCart({});
      toast.success("Đặt món thành công!");
    } catch (error) {
      toast.error("Đặt món thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Thực đơn nhà hàng</h1>
        <p className="text-lg text-muted-foreground">Chọn món bạn yêu thích</p>
      </div>

      <div className="mb-8 space-y-4">
        <div className="relative flex items-center justify-center gap-2">
          <Input
            placeholder="Tìm kiếm món ăn..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md mx-auto flex-grow"
          />

          <Drawer>
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
                  onClick={() => setSelectedType(null)}
                  className="w-full justify-start rounded-full"
                >
                  Tất cả
                </Button>
                {DishTypeValues.map((type) => (
                  <Button
                    key={type}
                    variant={selectedType === type ? "default" : "outline"}
                    onClick={() => setSelectedType(type)}
                    className="w-full justify-start rounded-full"
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </DrawerContent>
          </Drawer>

          <Sheet>
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
                  onClick={() => setSelectedType(null)}
                  className="w-full justify-start rounded-full"
                >
                  Tất cả
                </Button>
                {DishTypeValues.map((type) => (
                  <Button
                    key={type}
                    variant={selectedType === type ? "default" : "outline"}
                    onClick={() => setSelectedType(type)}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDishes.map((dish, index) => {
            const quantity = cart[dish.id] || 0;
            const uniqueKey = `${dish.id}-${index}`;
            return (
              <Card key={uniqueKey} className="flex flex-col">
                <CardHeader className="p-0">
                  <div className="relative">
                    <div className="w-full h-48 rounded-t-lg rounded-b-none relative">
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
                <CardContent className="flex-grow p-4">
                  <CardTitle className="mb-2">{dish.name}</CardTitle>
                  <div className="mt-4">
                    <p className="text-lg font-bold text-primary">
                      {formatCurrency(
                        Number(dish.basePrice) || Number(dish.virtualPrice)
                      )}
                    </p>

                    {dish.basePrice &&
                      Number(dish.basePrice) !== Number(dish.virtualPrice) && (
                        <p className="text-sm text-muted-foreground line-through">
                          {formatCurrency(
                            Number(dish.virtualPrice || dish.basePrice)
                          )}
                        </p>
                      )}
                  </div>
                </CardContent>

                <div className="p-4 pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(dish.id, -1)}
                        disabled={quantity === 0}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(dish.id, 1)}
                      >
                        +
                      </Button>
                    </div>
                    {quantity > 0 && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => updateQuantity(dish.id, -quantity)}
                      >
                        <Trash2 />
                      </Button>
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
  );
}
