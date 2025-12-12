"use client";
import { useLogoutMutation } from "@/lib/query/useAuth";
import { getRefreshTokenFromLocalStorage } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, Suspense } from "react";

const LogoutContent = () => {
  const { mutateAsync } = useLogoutMutation();
  const router = useRouter();
  const ref = useRef<any>(null);
  const searchParams = useSearchParams();
  const refreshTokenFromUrl = searchParams.get("refreshToken");

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
