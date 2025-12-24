"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLogoutMutation } from "@/lib/query/useAuth";
import { handleErrorApi } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useAccountMe } from "@/lib/query/useAccount";
import envConfig from "@/lib/validateEnv";
import { useAppStore } from "@/lib/store/app.store";

export default function DropdownAvatar() {
  const logoutMutation = useLogoutMutation();
  const router = useRouter();
  const { data } = useAccountMe();
  const account = data?.payload?.data;
  const setRole = useAppStore((state) => state.setRole);
  const disconnectSocket = useAppStore((state) => state.disconnectSocket);

  const logout = async () => {
    if (logoutMutation.isPending) return;
    try {
      await logoutMutation.mutateAsync();
      setRole();
      disconnectSocket();
      router.push("/");
    } catch (error) {
      handleErrorApi({ error });
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="overflow-hidden rounded-full"
        >
          <Avatar>
            <AvatarImage
              src={`${envConfig?.NEXT_PUBLIC_API_ENDPOINT}/static/avatars/${
                account?.avatar || "default.png"
              }`}
              alt={account?.name}
            />
            <AvatarFallback>
              {account?.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{account?.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={"/manage/setting"} className="cursor-pointer">
            Cài đặt
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">Hỗ trợ</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={logout}>
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
