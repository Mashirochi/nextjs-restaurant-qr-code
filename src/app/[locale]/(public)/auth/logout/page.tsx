"use client";
import { useLogoutMutation } from "@/lib/query/useAuth";
import { useAppStore } from "@/lib/store/app.store";
import { getRefreshTokenFromLocalStorage } from "@/lib/utils";
import { useRouter } from "@/lib/i18n/navigation";
import { useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";

const LogoutContent = () => {
  const { mutateAsync } = useLogoutMutation();
  const router = useRouter();
  const ref = useRef<any>(null);
  const searchParams = useSearchParams();
  const refreshTokenFromUrl = searchParams.get("refreshToken");
  const setRole = useAppStore((state) => state.setRole);
  const disconnectSocket = useAppStore((state) => state.disconnectSocket);

  useEffect(() => {
    if (
      ref.current ||
      refreshTokenFromUrl !== getRefreshTokenFromLocalStorage()
    ) {
      return;
    }
    ref.current = mutateAsync;
    mutateAsync().then((res) => {
      setTimeout(() => {
        ref.current == null;
      }, 1000);
      setRole();
      disconnectSocket();
      router.push("/auth/login");
    });
  }, [mutateAsync, refreshTokenFromUrl]);

  return null;
};

const LogoutPage = () => {
  return (
    <Suspense fallback={null}>
      <LogoutContent />
    </Suspense>
  );
};

export default LogoutPage;
