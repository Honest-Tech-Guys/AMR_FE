"use client";

import { InputWithIcon } from "@/components/InpuWithIcon";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  BarChart3,
  Bell,
  Calendar,
  Check,
  DollarSign,
  FileText,
  Home,
  Search,
  User,
  Wrench,
} from "lucide-react";
import { useState } from "react";

// import CreateMeter from "./CreateMeter";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useGetNotificationList from "@/lib/services/hooks/useGetNotificationList";
import { NotificationType } from "@/types/NotificationType";
const options = [
  {
    value: "Vacant",
    label: "Vacant (50)",
  },
  {
    value: "Occupied",
    label: "Occupied (32)",
  },
  {
    value: "Deactivated ",
    label: "Deactivated (24)",
  },
];
type property = {
  property_id: string;
  unit: string;
  room: string;
  smart_home: string;
  owner_name: string;
  rental: string;
  tenancy: string;
  status: string;
};
interface PaginationData {
  page: number;
  per_page: number;
}

const Page = () => {
  const [isFilter, setIsFilter] = useState(false);
  const { data, refetch } = useGetNotificationList();
  const filters = [
    <InputWithIcon key="property" icon={Search} placeholder="Property Name" />,
    <InputWithIcon key="unit" icon={Search} placeholder="Unit Number" />,
    <InputWithIcon key="rental" icon={Search} placeholder="Rental Type" />,
    <InputWithIcon key="meter" icon={Search} placeholder="Meter & Lock" />,
    <InputWithIcon key="date" icon={Calendar} placeholder="Date Range" />,
  ];

  const actionButton = (
    <Button key="search" className="rounded-[6px]">
      <Search className="size-4 text-white" strokeWidth={2.5} />
    </Button>
  );
  const [formFilters, setFormFilters] = useState({
    property_name: "",
    unit_name: "",
    rental_type: "",
    Meter_and_lock: [],
    data_range: "",
    status: "all",
    page: "1",
    per_page: "10",
  });
  const [activeFilter, setActiveFilter] = useState("all");
  const [notifications, setNotifications] = useState<NotificationType[]>(
    data?.notifications.data ?? []
  );

  // Helper to get icon based on notification type
  const getNotificationIcon = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes("payment"))
      return <DollarSign className="w-5 h-5" />;
    if (lowerType.includes("maintenance"))
      return <Wrench className="w-5 h-5" />;
    if (lowerType.includes("tenancy") || lowerType.includes("lease"))
      return <FileText className="w-5 h-5" />;
    if (lowerType.includes("inspection"))
      return <FileText className="w-5 h-5" />;
    if (lowerType.includes("booking")) return <Home className="w-5 h-5" />;
    if (lowerType.includes("tenant") || lowerType.includes("user"))
      return <User className="w-5 h-5" />;
    if (lowerType.includes("report")) return <BarChart3 className="w-5 h-5" />;
    if (lowerType.includes("alert") || lowerType.includes("warning"))
      return <AlertCircle className="w-5 h-5" />;
    return <Bell className="w-5 h-5" />;
  };

  // Helper to get background color based on notification type
  const getIconBgColor = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes("payment") || lowerType.includes("success"))
      return "bg-green-100 text-green-600";
    if (lowerType.includes("warning") || lowerType.includes("pending"))
      return "bg-yellow-100 text-yellow-600";
    if (
      lowerType.includes("danger") ||
      lowerType.includes("overdue") ||
      lowerType.includes("alert")
    )
      return "bg-red-100 text-red-600";
    return "bg-blue-100 text-blue-600";
  };

  // Format time ago
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
    const months = Math.floor(days / 30);
    return `${months} month${months > 1 ? "s" : ""} ago`;
  };

  // Extract tag from type
  const getTag = (type: string) => {
    // Convert from snake_case or PascalCase to Title Case
    return type
      .replace(/([A-Z])/g, " $1")
      .replace(/_/g, " ")
      .trim()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Filter notifications
  const filteredNotifications = notifications.filter((notification) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "unread") return notification.read_at === null;

    const lowerType = notification.type.toLowerCase();
    if (activeFilter === "payments") return lowerType.includes("payment");
    if (activeFilter === "maintenance")
      return lowerType.includes("maintenance");
    if (activeFilter === "tenancy")
      return (
        lowerType.includes("tenancy") ||
        lowerType.includes("lease") ||
        lowerType.includes("inspection")
      );

    return true;
  });

  // Calculate counts
  const filterCounts = {
    all: notifications.length,
    unread: data?.unread_count ?? 0,
    payments: notifications.filter((n) =>
      n.type.toLowerCase().includes("payment")
    ).length,
    maintenance: notifications.filter((n) =>
      n.type.toLowerCase().includes("maintenance")
    ).length,
    tenancy: notifications.filter((n) => {
      const type = n.type.toLowerCase();
      return (
        type.includes("tenancy") ||
        type.includes("lease") ||
        type.includes("inspection")
      );
    }).length,
  };

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    // API call to mark as read would go here
    // For now, update local state
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notificationId
          ? { ...n, read_at: new Date().toISOString() }
          : n
      )
    );
  };

  // Mark all as read
  const markAllAsRead = async () => {
    // API call to mark all as read would go here
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read_at: new Date().toISOString() }))
    );
  };

  // Handle notification click
  const handleNotificationClick = (notification: NotificationType) => {
    // Mark as read
    if (!notification.read_at) {
      markAsRead(notification.id);
    }

    // Navigate to URL if provided
    if (notification.data.url) {
      window.location.href = notification.data.url;
    }
  };
  return (
    <div>
      {/* <HeaderPage title="Announcement" /> */}
      <div className="w-full  rounded-[6px] p-3 mt-4 bg-white">
        {/* <ResponsiveFilter
          filters={[
            {
              name: "property_name",
              placeholder: "Property Name",
              type: "input",
              icon: Search,
            },
            {
              name: "unit_name",
              placeholder: "Unit Number",
              type: "input",
              icon: Search,
            },
            {
              name: "rental_type",
              placeholder: "Rental Type",
              type: "select",
              selectItems: [
                { label: "whole unit", value: "Whole Unit" },
                { label: "Room Rental", value: "Room Rental" },
              ],
              icon: Search,
            },
            {
              name: "Meter_and_lock",
              placeholder: "Meter and Lock",
              type: "input",
              icon: Search,
            },
            {
              name: "date_range",
              placeholder: "Date Range",
              type: "date",
              icon: Calendar,
            },
          ]}
          actionButton={
            <Button
              // onClick={() => setAppliedFilters(formFilters)}
              className="text-white"
            >
              <Search />
            </Button>
          }
          formFilters={formFilters}
          setFormFilters={setFormFilters as never}
        /> */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gpa-5 ">
          <div className=" border rounded-2xl p-3">
            <ViewNotification />
            <p>Title: Water Disruption on 15 June</p>
            <p>Property: Sky Residence Puchong</p>
            <p>
              Status:{" "}
              <Badge className="bg-[#F6FFED] text-[#52C41A] rounded-[6px] border-[#B7EB8F]">
                Active
              </Badge>{" "}
            </p>
            <div className="flex gap-10">
              <div>
                <Label>Notice Start Date</Label>
                <p>05 June 2025</p>
              </div>
              <div>
                <Label>Notice End Date</Label>
                <p>05 June 2025</p>
              </div>
            </div>
          </div>
        </div> */}
        <div className="min-h-screen bg-gray-50 p-8">
          {/* Page Header */}
          {/* <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Notifications
            </h1>
            <p className="text-sm text-gray-600">
              Stay updated with your property management activities
            </p>
          </div> */}

          {/* Notification Controls */}
          <Card className="mb-6 p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              {/* Filter Tabs */}
              <Tabs
                value={activeFilter}
                onValueChange={setActiveFilter}
                className="w-full md:w-auto"
              >
                <TabsList className="grid w-full md:w-auto grid-cols-2 md:flex gap-2">
                  <TabsTrigger value="all" className="gap-2 cursor-pointer">
                    All{" "}
                    <Badge variant="secondary" className="ml-1">
                      {filterCounts.all}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="unread" className="gap-2 cursor-pointer">
                    Unread{" "}
                    <Badge variant="secondary" className="ml-1">
                      {filterCounts.unread}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger
                    value="payments"
                    className="gap-2 cursor-pointer"
                  >
                    Payments{" "}
                    <Badge variant="secondary" className="ml-1">
                      {filterCounts.payments}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger
                    value="maintenance"
                    className="gap-2 cursor-pointer"
                  >
                    Maintenance{" "}
                    <Badge variant="secondary" className="ml-1">
                      {filterCounts.maintenance}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="tenancy" className="gap-2 cursor-pointer">
                    Tenancy{" "}
                    <Badge variant="secondary" className="ml-1">
                      {filterCounts.tenancy}
                    </Badge>
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Control Actions */}
              <div className="flex gap-3 w-full md:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 flex-1 md:flex-none"
                  onClick={markAllAsRead}
                >
                  <Check className="w-4 h-4" />
                  Mark all as read
                </Button>
                {/* <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 flex-1 md:flex-none"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </Button> */}
              </div>
            </div>
          </Card>

          {/* Notifications List */}
          <Card className="overflow-hidden">
            {filteredNotifications.length === 0 ? (
              <div className="p-12 text-center">
                <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No notifications
                </h3>
                <p className="text-sm text-gray-600">You're all caught up!</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`
                relative p-6 border-b last:border-b-0 transition-colors hover:bg-gray-50 cursor-pointer
                ${
                  !notification.read_at
                    ? "bg-green-50 border-l-4 border-l-green-500"
                    : ""
                }
              `}
                >
                  <div className="flex gap-4">
                    {/* Icon */}
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${getIconBgColor(
                        notification.type
                      )}`}
                    >
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {getTag(notification.type)}
                          </h3>
                          <p className="text-sm text-gray-600 whitespace-nowrap">
                            {formatTimeAgo(notification.created_at)}
                          </p>
                        </div>
                      </div>

                      <p className="text-sm text-gray-700 leading-relaxed mb-3">
                        {notification.data.message}
                      </p>

                      {/* Meta Info */}
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                        <Badge variant="secondary" className="font-semibold">
                          {getTag(notification.type)}
                        </Badge>
                        {notification.data.tenant_name && (
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {notification.data.tenant_name}
                          </span>
                        )}
                        {notification.data.tenancy_code && (
                          <span>{notification.data.tenancy_code}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </Card>

          {/* Pagination Info */}
          {data?.notifications.last_page &&
            data?.notifications.last_page > 1 && (
              <div className="mt-6 text-center text-sm text-gray-600">
                Page {data.notifications.current_page} of{" "}
                {data.notifications.last_page}
                <span className="mx-2">•</span>
                {/* {data.notifications.total} total notifications */}
              </div>
            )}
        </div>
      </div>
      {/* <MapWithPoints /> */}
    </div>
  );
};

// export default CheckRole(Page, ["admin"]);
export default Page;
