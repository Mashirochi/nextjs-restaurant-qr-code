"use client";
import { useSetTokenToCookieMutation } from "@/lib/query/useAuth";
import { useAppStore } from "@/lib/store/app.store";
import { decodeToken, generateSocketInstance } from "@/lib/utils";
import { useRouter } from "@/lib/i18n/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

type OauthContentProps = {
  loginFailedText: string;
};

export default function OauthContent({ loginFailedText }: OauthContentProps) {
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
            setSocket(generateSocketInstance(accessToken));
            router.push("/manage/dashboard");
          })
          .catch((e) => {
            toast.error(loginFailedText);
            console.error(e);
          });
        count.current++;
      }
    } else {
      if (count.current === 0) {
        setTimeout(() => {
          toast.error(loginFailedText);
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
    loginFailedText,
  ]);
  return null;
}
