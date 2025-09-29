"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

import { useRouter } from "next/navigation";
import { useState } from "react";
import NotificationList from "./NotificationList";
import useGetNotificationList from "@/lib/services/hooks/useGetNotificationList";
import useMarkAllNotifications from "@/lib/services/hooks/useMarkAllNotifications";

export type Notification = {
  id: string;
  title: string;
  description: string;
  created_at: string;
};

export const notifications: Notification[] = [
  {
    id: "1",
    title: "Contracts has been approved by Approval",
    description: "There is a contracts expired for Contract No: 123456",
    created_at: "2025-10-01T16:30:00Z",
  },
  {
    id: "2",
    title: "Contracts has been send reminder to PIC",
    description: "There is a contracts expired for Contract No: 123456",
    created_at: "2025-10-03T01:45:00Z",
  },
  {
    id: "3",
    title: "You have received new contract waiting for approval",
    description: "You may prepare build load for Contract No: 123456",
    created_at: "2025-10-03T02:20:00Z",
  },
  {
    id: "4",
    title: "You have assigned John Doe to a new task",
    description: "You Created 1 task for Contract No: 123456",
    created_at: "2025-10-03T03:10:00Z",
  },
  {
    id: "5",
    title: "Contracts has been approved by Jessica Gan",
    description:
      "There is a contracts has been approved for Contract No: 123456",
    created_at: "2025-10-03T08:00:00Z",
  },
  {
    id: "6",
    title: "Logged-in activity",
    description: "Employee PR001 has logged-in.",
    created_at: "2025-10-03T10:15:00Z",
  },
];

export function NotificationPopover() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { data, refetch } = useGetNotificationList();
  const { mutate: setAllNotificationRead } = useMarkAllNotifications();
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative bg-primary/10 hover:bg-primary/40 border-none rounded-full"
        >
          <Bell className="size-4 text-primary" />
          {(data?.unread_count as number) > 0 && (
            <span className="absolute -top-1 -right-1 size-3 p-2 bg-primary rounded-full text-xs text-white flex items-center justify-center">
              {data?.unread_count}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-full md:w-sm z-50 p-2"
        align="end"
        sideOffset={8}
      >
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 text-sm">Notifications</h3>
        </div>
        <div className="max-h-80 overflow-y-auto">
          <NotificationList notifications={data?.notifications.data ?? []} />
        </div>
        <div className=" flex p-4 pb-2  border-gray-100 gap-5">
          <button
            onClick={() => {
              setAllNotificationRead();
              refetch();
            }}
            className="text-xs font-bold text-primary hover:text-primary/80 hover:cursor-pointer transition-colors"
          >
            Read All
          </button>
          <button
            onClick={() => {
              setOpen(false);
              router.push("/notifications");
            }}
            className="text-xs font-bold text-primary hover:text-primary/80 hover:cursor-pointer transition-colors"
          >
            View All
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
