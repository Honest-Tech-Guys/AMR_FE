"use client";

import { cn, formatDate } from "@/lib/utils";
import { Notification } from "./NotificationPopover";
import useMarkNotification from "@/lib/services/hooks/useMarkNotificationRead";
import { NotificationType } from "@/types/NotificationType";
import useGetNotificationList from "@/lib/services/hooks/useGetNotificationList";

type NotificationList = {
  notifications: NotificationType[];
};

const NotificationList = ({ notifications }: NotificationList) => {
  const { mutate } = useMarkNotification();
  const { refetch } = useGetNotificationList();
  return (
    <>
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <div
            key={notification.id}
            className={cn(
              "flex items-start justify-between py-4 px-4 border-b border-gray-100 hover:cursor-pointer hover:bg-gray-50",
              notification.read_at ? null : "bg-primary/10"
            )}
            onClick={() => {
              mutate(notification.id);
              refetch();
            }}
          >
            <div className="flex-1 space-y-1">
              <h4 className="text-xs font-medium text-gray-900 leading-tight">
                {notification.data.tenant_name}
              </h4>
              <p className="text-xs text-gray-600 leading-tight">
                {notification.data.message}
              </p>
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {formatDate(notification.created_at, { withTime: true })}
              </span>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center font-light">No notifications</div>
      )}
    </>
  );
};

export default NotificationList;
