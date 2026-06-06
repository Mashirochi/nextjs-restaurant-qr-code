import http from "@/lib/http";
import {
  GetNotificationsResType,
  ResolveNotificationResType,
} from "@/type/schema/notification.schema";

const notificationRequest = {
  list: () => http.get<GetNotificationsResType>("/notifications"),
  resolve: (id: number) =>
    http.put<ResolveNotificationResType>(`/notifications/${id}/resolve`, {}),
};

export default notificationRequest;
