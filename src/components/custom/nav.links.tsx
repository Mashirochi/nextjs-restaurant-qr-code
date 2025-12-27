"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  Package2,
  Settings,
  Settings2,
  SettingsIcon,
  TreePine,
} from "lucide-react";
import { Link } from "@/lib/i18n/navigation";

import { usePathname } from "@/lib/i18n/navigation";
import {
  Home,
  LineChart,
  ShoppingCart,
  Users2,
  Salad,
  Table,
  Ticket,
  Mail,
} from "lucide-react";
import { Role } from "@/type/constant";
import { useAppStore } from "@/lib/store/app.store";

export const menuItems = [
  {
    title: "Dashboard",
    Icon: Home,
    href: "/manage/dashboard",
    role: [Role.Owner, Role.Employee],
  },
  {
    title: "Đơn hàng",
    Icon: ShoppingCart,
    href: "/manage/orders",
    role: [Role.Owner, Role.Employee],
  },
  {
    title: "Bàn ăn",
    Icon: Table,
    href: "/manage/tables",
    role: [Role.Owner, Role.Employee],
  },
  {
    title: "Món ăn",
    Icon: Salad,
    href: "/manage/dishes",
    role: [Role.Owner, Role.Employee],
  },

  {
    title: "Phân tích",
    Icon: LineChart,
    href: "/manage/analytics",
    role: [Role.Owner, Role.Employee],
  },
  {
    title: "Nhân viên",
    Icon: Users2,
    href: "/manage/accounts",
    role: [Role.Owner],
  },
  {
    title: "NavItem.ticket",
    Icon: Ticket,
    href: "/manage/ticket",
    role: [Role.Owner, Role.Employee],
  },
  {
    title: "NavItem.cactus",
    Icon: TreePine,
    href: "/manage/cactus",
    role: [Role.Owner, Role.Employee],
  },
  {
    title: "NavItem.letter",
    Icon: Mail,
    href: "/manage/letter",
    role: [Role.Owner, Role.Employee],
  },
  {
    title: "Setting",
    Icon: SettingsIcon,
    href: "/manage/setting",
    role: [Role.Owner, Role.Employee, Role.Pthao],
  },
];

export default function NavLinks() {
  const pathname = usePathname();
  const role = useAppStore((state) => state.role);
  return (
    <TooltipProvider>
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 py-4">
          <Link
            href="#"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
            <span className="sr-only">Acme Inc</span>
          </Link>

          {menuItems.map((Item, index) => {
            const isActive = pathname === Item.href;
            if (!Item.role.includes(role as "Owner" | "Employee")) return null;
            return (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Link
                    href={Item.href}
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8",
                      {
                        "bg-accent text-accent-foreground": isActive,
                        "text-muted-foreground": !isActive,
                      }
                    )}
                  >
                    <Item.Icon className="h-5 w-5" />
                    <span className="sr-only">{Item.title}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{Item.title}</TooltipContent>
              </Tooltip>
            );
          })}
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 py-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/manage/setting"
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg  transition-colors hover:text-foreground md:h-8 md:w-8",
                  {
                    "bg-accent text-accent-foreground":
                      pathname === "/manage/setting",
                    "text-muted-foreground": pathname !== "/manage/setting",
                  }
                )}
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Cài đặt</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Cài đặt</TooltipContent>
          </Tooltip>
        </nav>
      </aside>
    </TooltipProvider>
  );
}
