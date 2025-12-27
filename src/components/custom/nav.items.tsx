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
import { Link, useRouter } from "@/lib/i18n/navigation";
import { useTranslations } from "next-intl";

const menuItems: {
  title: string;
  href: string;
  role?: RoleType[];
  hideWhenLogin?: boolean;
}[] = [
  {
    title: "NavItem.home",
    href: "/",
  },
  {
    title: "NavItem.menu",
    href: "/menu",
    role: [Role.Guest],
  },
  {
    title: "NavItem.orders",
    href: "/orders",
    role: [Role.Guest],
  },
  {
    title: "NavItem.login",
    href: "/auth/login",
    hideWhenLogin: true,
  },
  {
    title: "NavItem.manage",
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
  const t = useTranslations();
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
              {t(item.title)}
            </Link>
          );
        }
        return null;
      })}
      {role && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div>{t("NavItem.logout")}</div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {t("NavItem.logoutDialog.logoutQuestion")}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t("NavItem.logoutDialog.logoutCancel")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                {t("NavItem.logoutDialog.logoutConfirm")}
              </AlertDialogCancel>
              <AlertDialogAction onClick={logout}>
                {t("NavItem.logoutDialog.logoutCancel")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
