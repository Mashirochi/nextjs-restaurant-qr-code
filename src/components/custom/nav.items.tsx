"use client";
import { cn, handleErrorApi } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { RoleType } from "@/type/schema/jwt.type";
import { Role } from "@/type/constant";
import { useAppStore } from "@/lib/store/app.store";
import { useLogoutMutation } from "@/lib/query/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";

const menuItems: {
  title: string;
  href: string;
  role?: RoleType[];
  hideWhenLogin?: boolean;
}[] = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Menu",
    href: "/guest/menu",
    role: [Role.Guest],
  },
  {
    title: "Orders",
    href: "/guest/orders",
    role: [Role.Guest],
  },
  {
    title: "Login",
    href: "/auth/login",
    hideWhenLogin: true,
  },
  {
    title: "manage",
    href: "/manage/dashboard",
    role: [Role.Owner, Role.Employee],
  },
];

export default function NavItems({ className }: { className?: string }) {
  const role = useAppStore((state) => state.role);
  const setRole = useAppStore((state) => state.setRole);
  const disconnectSocket = useAppStore((state) => state.disconnectSocket);
  const logoutMutation = useLogoutMutation();
  const router = useRouter();
  const logout = async () => {
    if (logoutMutation.isPending) return;
    try {
      await logoutMutation.mutateAsync();
      setRole();
      disconnectSocket();
      router.push("/");
    } catch (error) {
      handleErrorApi({
        error,
      });
    }
  };
  return (
    <>
      {menuItems.map((item) => {
        // Trường hợp đăng nhập thì chỉ hiển thị menu đăng nhập
        const isAuth = item.role && role && item.role.includes(role);
        // Trường hợp menu item có thể hiển thị dù cho đã đăng nhập hay chưa
        const canShow =
          (item.role === undefined && !item.hideWhenLogin) ||
          (!role && item.hideWhenLogin);
        if (isAuth || canShow) {
          return (
            <Link href={item.href} key={item.href} className={className}>
              {item.title}
            </Link>
          );
        }
        return null;
      })}
      {role && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div>Logout</div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to log out?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Cancel to stay logged in.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                Signing out may result in loss of your orders
              </AlertDialogCancel>
              <AlertDialogAction onClick={logout}>OK</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
