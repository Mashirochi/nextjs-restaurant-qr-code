"use client";
import { useEffect } from "react";
import { useAppStore } from "@/lib/store/app.store";
import { NotificationSchemaType } from "@/type/schema/notification.schema";
import notificationRequest from "@/lib/api/notification.request";
import { toast } from "sonner";
import { Bell } from "lucide-react";
import { useRouter } from "@/lib/i18n/navigation";

export default function NotificationListener() {
  const socket = useAppStore((state) => state.socket);
  const router = useRouter();
  const setUnresolvedNotificationCount = useAppStore(
    (state) => state.setUnresolvedNotificationCount
  );

  // Fetch initial unresolved count on mount
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await notificationRequest.list();
        const unresolved = res.payload.data.filter((n) => !n.resolve).length;
        setUnresolvedNotificationCount(unresolved);
      } catch {
        // silently fail
      }
    };
    fetchCount();
  }, [setUnresolvedNotificationCount]);

  useEffect(() => {
    if (!socket) return;

    const handleNotification = (notification: NotificationSchemaType) => {
      // Increment unresolved count
      const current = useAppStore.getState().unresolvedNotificationCount;
      setUnresolvedNotificationCount(current + 1);

      toast(
        <div className="flex items-start gap-3">
          <div className="mt-0.5 p-1.5 rounded-full bg-orange-100 dark:bg-orange-900/40 shrink-0">
            <Bell className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">
              {notification.table !== null
                ? `Bàn ${notification.table} gọi phục vụ`
                : "Thông báo mới"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {notification.message}
            </p>
          </div>
        </div>,
        {
          duration: 8000,
          action: {
            label: "Xem",
            onClick: () => router.push("/manage/notification"),
          },
        }
      );
    };

    socket.on("get-notification", handleNotification);
    return () => {
      socket.off("get-notification", handleNotification);
    };
  }, [socket, router, setUnresolvedNotificationCount]);

  return null;
}
