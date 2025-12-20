"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useState, useEffect, useCallback } from "react";
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
  const [displayedDishes, setDisplayedDishes] = useState<
    z.infer<typeof DishSchema>[]
  >(initialDishes.slice(0, 20));
  const [allDishes] = useState<z.infer<typeof DishSchema>[]>(initialDishes);
  const [loadingMore, setLoadingMore] = useState(false);
  const { mutateAsync } = useGuestCreateOrderMutation();
  const filteredDishes = displayedDishes.filter((dish) => {
    const matchesType = selectedType ? dish.type === selectedType : true;
    const matchesSearch = dish.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Load more dishes when scrolling to bottom
  const loadMoreDishes = useCallback(() => {
    if (loadingMore || displayedDishes.length >= allDishes.length) return;

    setLoadingMore(true);

    // Simulate API delay
    setTimeout(() => {
      const currentLength = displayedDishes.length;
      const nextDishes = allDishes.slice(currentLength, currentLength + 20);
      setDisplayedDishes((prev) => [...prev, ...nextDishes]);
      setLoadingMore(false);
    }, 500);
  }, [displayedDishes.length, allDishes, loadingMore]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1000
      ) {
        loadMoreDishes();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMoreDishes]);

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
      sum + Number(item.basePrice ?? item.virtualPrice) * item.quantity,
    0
  );

  const totalVirtualPrice = cartItems.reduce(
    (sum, item) => sum + Number(item.virtualPrice) * item.quantity,
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
                            Number(item.basePrice ?? item.virtualPrice)
                          )}{" "}
                          x {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold">
                        {formatCurrency(
                          Number(item.basePrice ?? item.virtualPrice) *
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
                    <Avatar className="w-full h-48 rounded-t-lg rounded-b-none">
                      <AvatarImage
                        src={`${envConfig.NEXT_PUBLIC_API_ENDPOINT}/static/dishes/${dish.image}`}
                        alt={dish.name}
                        className="object-cover w-full h-full"
                      />
                      <AvatarFallback className="rounded-t-lg rounded-b-none bg-muted">
                        {dish.name}
                      </AvatarFallback>
                    </Avatar>
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
                        Number(dish.basePrice ?? dish.virtualPrice)
                      )}
                    </p>

                    {dish.basePrice &&
                      Number(dish.basePrice) !== Number(dish.virtualPrice) && (
                        <p className="text-sm text-muted-foreground line-through">
                          {formatCurrency(Number(dish.virtualPrice))}
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
                          Number(item.basePrice ?? item.virtualPrice)
                        )}{" "}
                        x {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold">
                      {formatCurrency(
                        Number(item.basePrice ?? item.virtualPrice) *
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
