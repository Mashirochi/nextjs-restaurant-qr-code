"use client";
import { useSetTokenToCookieMutation } from "@/lib/query/useAuth";
import { useAppStore } from "@/lib/store/app.store";
import { decodeToken, generateSocketInstace } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export default function Oauth() {
  const { mutateAsync } = useSetTokenToCookieMutation();
  const router = useRouter();
  const count = useRef(0);
  const setSocket = useAppStore((state) => state.setSocket);
  const setRole = useAppStore((state) => state.setRole);

  const searchParams = useSearchParams();
  const accessToken = searchParams.get("accessToken");
  const refreshToken = searchParams.get("refreshToken");
  const message = searchParams.get("message");
  useEffect(() => {
    if (accessToken && refreshToken) {
      if (count.current === 0) {
        const { role } = decodeToken(accessToken);
        mutateAsync({ accessToken, refreshToken })
          .then(() => {
            setRole(role);
            setSocket(generateSocketInstace(accessToken));
            router.push("/manage/dashboard");
          })
          .catch((e) => {
            toast.error("Đăng nhập thất bại");
            console.error(e);
          });
        count.current++;
      }
    } else {
      if (count.current === 0) {
        setTimeout(() => {
          toast.error("Đăng nhập thất bại");
        });
        count.current++;
      }
    }
  }, [
    accessToken,
    refreshToken,
    setRole,
    router,
    setSocket,
    message,
    mutateAsync,
  ]);
  return null;
}
