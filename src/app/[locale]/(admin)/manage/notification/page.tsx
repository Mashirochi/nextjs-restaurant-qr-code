"use client";
import { useEffect, useState, useCallback } from "react";
import { useAppStore } from "@/lib/store/app.store";
import { NotificationSchemaType } from "@/type/schema/notification.schema";
import notificationRequest from "@/lib/api/notification.request";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bell,
  BellOff,
  CheckCircle2,
  Clock,
  RefreshCw,
  TableProperties,
} from "lucide-react";
import { cn } from "@/lib/utils";

function timeAgo(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return `${diffSec} giây trước`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} phút trước`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} giờ trước`;
  return d.toLocaleDateString("vi-VN");
}

export default function NotificationPage() {
  const socket = useAppStore((state) => state.socket);
  const setUnresolvedNotificationCount = useAppStore(
    (state) => state.setUnresolvedNotificationCount
  );
  const [notifications, setNotifications] = useState<NotificationSchemaType[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolving, setResolving] = useState<number | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await notificationRequest.list();
      // Sort by createdAt descending (newest first)
      const sorted = [...res.payload.data].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setNotifications(sorted);
      // Sync unresolved count to store
      setUnresolvedNotificationCount(sorted.filter((n) => !n.resolve).length);
    } catch {
      toast.error("Không thể tải danh sách thông báo");
    } finally {
      setLoading(false);
    }
  }, [setUnresolvedNotificationCount]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Listen for real-time notifications via socket
  useEffect(() => {
    if (!socket) return;
    const handleNewNotification = (notification: NotificationSchemaType) => {
      setNotifications((prev) => [notification, ...prev]);
    };
    socket.on("get-notification", handleNewNotification);
    return () => {
      socket.off("get-notification", handleNewNotification);
    };
  }, [socket]);

  const handleResolve = async (id: number) => {
    try {
      setResolving(id);
      await notificationRequest.resolve(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, resolve: true } : n))
      );
      // Decrement unresolved count in store
      const current = useAppStore.getState().unresolvedNotificationCount;
      setUnresolvedNotificationCount(Math.max(0, current - 1));
      toast.success("Đã đánh dấu giải quyết xong!");
    } catch {
      toast.error("Không thể cập nhật thông báo");
    } finally {
      setResolving(null);
    }
  };

  const pending = notifications.filter((n) => !n.resolve);
  const resolved = notifications.filter((n) => n.resolve);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Thông báo gọi phục vụ</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Danh sách yêu cầu từ khách hàng theo thời gian thực
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchNotifications}
          disabled={loading}
          className="gap-2"
        >
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          Tải lại
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Chờ xử lý
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-orange-500" />
              <span className="text-2xl font-bold text-orange-600">
                {pending.length}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Đã xử lý
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold text-green-600">
                {resolved.length}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-2 sm:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tổng thông báo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <BellOff className="h-5 w-5 text-muted-foreground" />
              <span className="text-2xl font-bold">{notifications.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {loading ? (
          <div className="flex flex-col gap-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-20 rounded-xl bg-muted animate-pulse"
              />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
            <Bell className="h-12 w-12 opacity-30" />
            <p className="text-lg font-medium">Chưa có thông báo nào</p>
            <p className="text-sm">Thông báo từ khách hàng sẽ xuất hiện tại đây</p>
          </div>
        ) : (
          <>
            {/* Pending */}
            {pending.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide px-1">
                  Chờ xử lý ({pending.length})
                </h2>
                {pending.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onResolve={handleResolve}
                    resolving={resolving === notification.id}
                  />
                ))}
              </div>
            )}

            {/* Resolved */}
            {resolved.length > 0 && (
              <div className="space-y-2 mt-4">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide px-1">
                  Đã xử lý ({resolved.length})
                </h2>
                {resolved.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onResolve={handleResolve}
                    resolving={resolving === notification.id}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

function NotificationCard({
  notification,
  onResolve,
  resolving,
}: {
  notification: NotificationSchemaType;
  onResolve: (id: number) => void;
  resolving: boolean;
}) {
  return (
    <Card
      className={cn(
        "transition-all border-l-4",
        notification.resolve
          ? "border-l-green-400 opacity-60"
          : "border-l-orange-400 shadow-sm hover:shadow-md"
      )}
    >
      <CardContent className="p-4 flex items-start gap-3">
        {/* Icon */}
        <div
          className={cn(
            "mt-0.5 p-2 rounded-full shrink-0",
            notification.resolve
              ? "bg-green-100 dark:bg-green-900/30"
              : "bg-orange-100 dark:bg-orange-900/30"
          )}
        >
          {notification.resolve ? (
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
          ) : (
            <Bell className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            {notification.table !== null && (
              <Badge
                variant="outline"
                className="text-xs gap-1 border-slate-300 dark:border-slate-600"
              >
                <TableProperties className="h-3 w-3" />
                Bàn {notification.table}
              </Badge>
            )}
            <Badge
              className={cn(
                "text-xs",
                notification.resolve
                  ? "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/40 dark:text-green-400"
                  : "bg-orange-100 text-orange-700 hover:bg-orange-100 dark:bg-orange-900/40 dark:text-orange-400"
              )}
            >
              {notification.resolve ? "Đã xử lý" : "Chờ xử lý"}
            </Badge>
          </div>
          <p className="text-sm font-medium text-foreground">
            {notification.message}
          </p>
          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{timeAgo(notification.createdAt)}</span>
          </div>
        </div>

        {/* Action */}
        {!notification.resolve && (
          <Button
            size="sm"
            variant="outline"
            className="shrink-0 gap-1.5 text-xs h-8 border-green-300 text-green-700 hover:bg-green-50 hover:text-green-800 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-900/30"
            onClick={() => onResolve(notification.id)}
            disabled={resolving}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            {resolving ? "..." : "Xử lý xong"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
