"use client";

import { useAppStore } from "@/lib/store/app.store";
import {
  checkAndRefreshToken,
  generateSocketInstance,
  getAccessTokenFromLocalStorage,
} from "@/lib/utils";
import { usePathname, useRouter } from "@/lib/i18n/navigation";
import { useEffect } from "react";

// Những page sau sẽ không check refesh token
const UNAUTHENTICATED_PATH = [
  "/auth/login",
  "/auth/logout",
  "/auth/refresh-token",
];
export default function RefreshToken() {
  const pathname = usePathname();
  const router = useRouter();
  const socket = useAppStore((state) => state.socket);
  const setSocket = useAppStore((state) => state.setSocket);
  const isAuth = useAppStore((state) => state.isAuth);
  const disconnectSocket = useAppStore((state) => state.disconnectSocket);

  // Auto-reconnect socket khi user đã login nhưng socket chưa có
  // (ví dụ sau khi refresh page, socket instance bị mất do không persist)
  useEffect(() => {
    if (UNAUTHENTICATED_PATH.includes(pathname)) return;
    if (isAuth && !socket) {
      const accessToken = getAccessTokenFromLocalStorage();
      if (accessToken) {
        setSocket(generateSocketInstance(accessToken));
      }
    }
  }, [isAuth, socket, pathname, setSocket]);

  useEffect(() => {
    if (UNAUTHENTICATED_PATH.includes(pathname)) return;
    let interval: any = null;
    const onRefreshToken = (force?: boolean) => {
      checkAndRefreshToken({
        onError: () => {
          clearInterval(interval);
          disconnectSocket();
          router.push("/auth/login");
        },
        force,
      });
    };

    onRefreshToken();
    // Timeout interval phải bé hơn thời gian hết hạn của access token
    // Ví dụ thời gian hết hạn access token là 10s thì 1s mình sẽ cho check 1 lần
    const TIMEOUT = 1000;
    interval = setInterval(onRefreshToken, TIMEOUT);

    if (socket?.connected) {
      onConnect();
    }

    function onConnect() {
      console.log("check socket id", socket?.id);
    }

    function onDisconnect() {
      console.log("disconnect", socket?.id);
    }

    function onRefreshTokenSocket() {
      onRefreshToken(true);
    }
    socket?.on("connect", onConnect);
    socket?.on("disconnect", onDisconnect);
    socket?.on("refresh-token", onRefreshTokenSocket);
    return () => {
      clearInterval(interval);
      socket?.off("connect", onConnect);
      socket?.off("disconnect", onDisconnect);
      socket?.off("refresh-token", onRefreshTokenSocket);
    };
  }, [pathname, router, socket, disconnectSocket]);
  return null;
}
