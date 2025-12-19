import { clsx, type ClassValue } from "clsx";
import { UseFormSetError } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { EntityError } from "./http";
import { toast } from "sonner";
import { DishStatus, TableStatus } from "@/type/constant";
import envConfig from "./validateEnv";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const isClient = typeof window !== "undefined";

export const getAccessTokenFromLocalStorage = () =>
  isClient ? localStorage.getItem("accessToken") : null;

export const getRefreshTokenFromLocalStorage = () =>
  isClient ? localStorage.getItem("refreshToken") : null;

export const setAccessTokenToLocalStorage = (value: string) =>
  isClient && localStorage.setItem("accessToken", value);

export const setRefreshTokenToLocalStorage = (value: string) =>
  isClient && localStorage.setItem("refreshToken", value);
export const removeTokensFromLocalStorage = () => {
  isClient && localStorage.removeItem("accessToken");
  isClient && localStorage.removeItem("refreshToken");
};

export const getCookie = (name: string): string | undefined => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookiePart = parts.pop();
    if (cookiePart) {
      return cookiePart.split(";").shift();
    }
  }
  return undefined;
};

export const handleErrorApi = ({
  error,
  setError,
  duration,
}: {
  error: any;
  setError?: UseFormSetError<any>;
  duration?: number;
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((item) => {
      setError(item.field, {
        type: "server",
        message: item.message,
      });
    });
  } else {
    toast("Error", {
      description: error?.payload?.message ?? "Lỗi không xác định",
      duration: duration ?? 5000,
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    });
  }
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

export const getVietnameseDishStatus = (status: string) => {
  switch (status) {
    case DishStatus.Available:
      return "Còn hàng";
    case DishStatus.Unavailable:
      return "Hết hàng";
    case DishStatus.Hidden:
      return "Ngừng kinh doanh";
    default:
      return "Không xác định";
  }
};

export const getVietnameseTableStatus = (status: string) => {
  switch (status) {
    case TableStatus.Available:
      return "Khả dụng";
    case TableStatus.Hidden:
      return "Đang sử dụng";
    case TableStatus.Reserved:
      return "Đã đặt trước";
    default:
      return "Không xác định";
  }
};

export const getTableLink = (tableNumber: number, token: string) => {
  return `${envConfig.NEXT_PUBLIC_URL}/table/${tableNumber}?token=${token}`;
};
