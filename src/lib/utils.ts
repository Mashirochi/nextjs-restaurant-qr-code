import { clsx, type ClassValue } from "clsx";
import { UseFormSetError } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { EntityError } from "./http";
import { toast } from "sonner";
import { DishStatus, OrderStatus, Role, TableStatus } from "@/type/constant";
import envConfig from "./validateEnv";
import { BookX, CookingPot, HandCoins, Loader, Truck } from "lucide-react";
import { format } from "date-fns";
import { jwtDecode } from "jwt-decode";
import { TokenPayload } from "@/type/schema/jwt.type";
import guestApiRequest from "./api/guest.request";
import authApiRequest from "./api/auth.request";
import { io } from "socket.io-client";

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

export const getVietnameseOrderStatus = (status: string) => {
  switch (status) {
    case OrderStatus.Pending:
      return "Đang chờ xử lý";
    case OrderStatus.Processing:
      return "Đang chuẩn bị";
    case OrderStatus.Delivered:
      return "Đã giao hàng";
    case OrderStatus.Paid:
      return "Đã thanh toán";
    case OrderStatus.Rejected:
      return "Bị từ chối";
    default:
      return "Không xác định";
  }
};
export const getTableLink = (tableNumber: number, token: string) => {
  return `${envConfig.NEXT_PUBLIC_URL}/table/${tableNumber}?token=${token}`;
};

export const removeAccents = (str: string) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
};
export const simpleMatchText = (text: string, filter: string) => {
  return removeAccents(text.toLowerCase()).includes(
    removeAccents(filter.toLowerCase())
  );
};

export const formatDateTimeToLocaleString = (date: Date | string) => {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

export const OrderStatusIcon = {
  [OrderStatus.Pending]: Loader,
  [OrderStatus.Processing]: CookingPot,
  [OrderStatus.Rejected]: BookX,
  [OrderStatus.Delivered]: Truck,
  [OrderStatus.Paid]: HandCoins,
};

export const formatDateTimeToTimeString = (date: string | Date) => {
  return format(date instanceof Date ? date : new Date(date), "HH:mm:ss");
};

export const getOrderStatusText = (status: string) => {
  switch (status) {
    case OrderStatus.Pending:
      return "Chờ xử lý";
    case OrderStatus.Processing:
      return "Đang chế biến";
    case OrderStatus.Rejected:
      return "Đã hủy";
    case OrderStatus.Delivered:
      return "Đã phục vụ";
    case OrderStatus.Paid:
      return "Đã thanh toán";
    default:
      return status;
  }
};

export const decodeToken = (token: string) => {
  return jwtDecode(token) as TokenPayload;
};

export const checkAndRefreshToken = async (param?: {
  onError?: () => void;
  onSuccess?: () => void;
  force?: boolean;
}) => {
  const accessToken = getAccessTokenFromLocalStorage();
  const refreshToken = getRefreshTokenFromLocalStorage();

  // Chưa đăng nhập thì cũng không cho chạy
  if (!accessToken || !refreshToken) return;

  const decodedAccessToken = decodeToken(accessToken);
  const decodedRefreshToken = decodeToken(refreshToken);
  // Thời điểm hết hạn của token là tính theo epoch time (s)
  // Còn khi các bạn dùng cú pháp new Date().getTime() thì nó sẽ trả về epoch time (ms)
  const now = Math.round(new Date().getTime() / 1000);
  // trường hợp refresh token hết hạn thì cho logout
  if (decodedRefreshToken.exp <= now) {
    removeTokensFromLocalStorage();
    return param?.onError && param.onError();
  }
  // Ví dụ access token của chúng ta có thời gian hết hạn là 10s
  // thì mình sẽ kiểm tra còn 1/3 thời gian (3s) thì mình sẽ cho refresh token lại
  // Thời gian còn lại sẽ tính dựa trên công thức: decodedAccessToken.exp - now
  // Thời gian hết hạn của access token dựa trên công thức: decodedAccessToken.exp - decodedAccessToken.iat
  if (
    param?.force ||
    decodedAccessToken.exp - now <
      (decodedAccessToken.exp - decodedAccessToken.iat) / 3
  ) {
    try {
      const role = decodedRefreshToken.role;
      const res =
        role === Role.Guest
          ? await guestApiRequest.refreshToken()
          : await authApiRequest.refreshToken();
      setAccessTokenToLocalStorage(res.payload.data.accessToken);
      setRefreshTokenToLocalStorage(res.payload.data.refreshToken);
      param?.onSuccess && param.onSuccess();
    } catch (error) {
      param?.onError && param.onError();
    }
  }
};

export const getOauthGoogleUrl = () => {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";

  const options = {
    redirect_uri: `${envConfig.NEXT_PUBLIC_GOOGLE_AUTHORIZED_REDIRECT_URI}`,
    client_id: envConfig.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };

  const qs = new URLSearchParams(options);
  return `${rootUrl}?${qs.toString()}`;
};

export const generateSocketInstace = (accessToken: string) => {
  return io(envConfig.NEXT_PUBLIC_API_ENDPOINT, {
    auth: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
