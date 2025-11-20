"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { ChevronRight, House, UserCog } from "lucide-react";
import Image from "next/image";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import RenterIcon from "@/lib/icons/RenterIcon";
import DashboardIconB from "@/lib/icons/DashboardIconB";
import DashboardIconA from "@/lib/icons/DashboardIconA";
import PropertyIconA from "@/lib/icons/PropertyIconA";
import PropertyIconB from "@/lib/icons/PropertyIconB";
import TenancyIconA from "@/lib/icons/TenancyIconA";
import TenancyIconB from "@/lib/icons/TenancyIconB";
import BookingIconA from "@/lib/icons/BookingIconA";
import BookingIconB from "@/lib/icons/BookingIconB";
import SmartHomeIconA from "@/lib/icons/SmartHomeIconA";
import SmartHomeIconB from "@/lib/icons/SmartHomeIconB";
import PayoutIconA from "@/lib/icons/PayoutIconA";
import PayoutIconB from "@/lib/icons/PayoutIconB";
import PeopleIconA from "@/lib/icons/PeopleIconA";
import PeopleIconB from "@/lib/icons/PeopleIconB";
import AccountigIconA from "@/lib/icons/AccountigIconA";
import AccountingIconB from "@/lib/icons/AccountingIconB";
import NotificationIconA from "@/lib/icons/NotificationIconA";
import NotificationIconB from "@/lib/icons/NotificationIconB";
import ReportIconA from "@/lib/icons/ReportIconA";
import ReportIconB from "@/lib/icons/ReportIconB";
import Link from "next/link";
import { useAuthStore } from "@/lib/stores/authStore";

// Menu configuration

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user_role } = useAuthStore();
  const menuItems = [
    {
      title: "Dashboard",
      url: "/",
      icon_active: <DashboardIconA />,
      icon: <DashboardIconB />,
    },
    {
      title: "Property",
      icon_active: <PropertyIconA />,
      icon: <PropertyIconB />,
      items: [
        { title: "List View", url: "/property/list-view" },
        { title: "Grid View", url: "/property/grid-view" },
        // { title: "Setting", url: "/booking/property-setting" },
      ],
    },
    {
      title: "Tenancy",
      icon_active: <TenancyIconA />,
      icon: <TenancyIconB />,
      url: "/tenancy",
    },
    {
      title: "Booking",
      icon_active: <BookingIconA />,
      icon: <BookingIconB />,
      items: [
        { title: "List View", url: "/booking/list-view" },
        { title: "Grid View", url: "/booking/grid-view" },
        // { title: "Setting", url: "/booking/booking-setting" },
      ],
    },
    {
      title: "Smart Home",
      icon_active: <SmartHomeIconA />,
      icon: <SmartHomeIconB />,
      items: [
        { title: "Meter", url: "/smart-home/meter" },
        { title: "Lock", url: "/smart-home/lock" },
      ],
    },
    {
      title: "Payout",
      icon_active: <PayoutIconA />,
      icon: <PayoutIconB />,
      items: [
        { title: "Pending", url: "/payout/pending" },
        { title: "Generated", url: "/payout/generated" },
      ],
    },
    {
      title: "People",
      icon_active: <PeopleIconA />,
      icon: <PeopleIconB />,
      items: [
        { title: "Tenant", url: "/people/tenant" },
        ...(user_role === "Owner"
          ? []
          : [{ title: "Owner", url: "/people/owner" }]),
        ...(user_role === "Tenant"
          ? []
          : [{ title: "Beneficiary", url: "/people/beneficiary" }]),
      ],
    },
    ...(user_role === "Admin"
      ? [
          {
            title: "User Management",
            icon_active: <UserCog className="text-primary-foreground" />,
            icon: <UserCog className="text-gray-400" />,
            items: [
              { title: "Users", url: "/user-management/users" },
              {
                title: "Role & Permissions",
                url: "/user-management/role_and_permissions",
              },
            ],
          },
        ]
      : []),
    {
      title: "Accounting",
      icon_active: <AccountigIconA />,
      icon: <AccountingIconB />,
      items: [
        { title: "Invoice", url: "/accounting/invoice" },
        { title: "Expenses", url: "/accounting/expenses" },
        { title: "Settlement", url: "/accounting/settlement" },
        // { title: "Daily Report", url: "/accounting/daily-report" },
        // { title: "Auto Collection", url: "/accounting/auto-collection" },
      ],
    },
    {
      title: "Notifications",
      url: "/notifications",
      icon_active: <NotificationIconA />,
      icon: <NotificationIconB />,
    },
    {
      title: "Reports",
      icon_active: <ReportIconA />,
      icon: <ReportIconB />,
      items: [
        { title: "Tenancy Status", url: "/reports/tenancy-status" },
        { title: "Property Status", url: "/reports/property-status" },
        { title: "Transactions", url: "/reports/transactions" },
        { title: "Tenant Statement", url: "/reports/tenant-statement" },
        { title: "Owner Statement", url: "/reports/owner-statement" },
        { title: "Meter Transaction", url: "/reports/meter-transaction" },
      ],
    },
  ];
  const pathname = usePathname();

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <Link href={"/"}>
          <div className="flex justify-center items-center">
            <img src="/Logo1.png" alt="Logo" width={204} height={71} />
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {menuItems.map((item) => {
          const hasChildren =
            Array.isArray(item.items) && item.items.length > 0;

          // Check if the parent or any child item is active
          const isChildActive =
            hasChildren &&
            item.items?.some((child) => pathname.startsWith(child.url));

          const isItemActive = !hasChildren && pathname === item.url;

          if (!hasChildren) {
            return (
              <SidebarGroup key={item.title} className="py-0">
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      className={
                        isItemActive
                          ? "bg-gradient-to-r from-primary to-primary/80 text-white   py-5  rounded-sm hover:bg-primary-foreground hover:text-white"
                          : "font-semibold py-5 rounded-sm hover:bg-gradient-to-r from-primary to-primary/80 hover:text-white "
                      }
                    >
                      <Link
                        href={item.url as string}
                        className="flex items-center gap-2 text-white "
                      >
                        {item.icon}
                        {item.title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
            );
          }

          return (
            <Collapsible
              defaultOpen={isChildActive}
              key={item.title}
              className="group/collapsible "
            >
              <SidebarGroup className="py-0">
                <SidebarGroupLabel
                  asChild
                  className={`group/label text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-white  ${
                    isChildActive
                      ? "bg-primary-foreground  py-5 text-primary-foreground rounded-sm hover:bg-primary-foreground hover:text-white"
                      : "text-sidebar-foreground py-5 rounded-sm hover:bg-primary-foreground hover:text-white "
                  }`}
                >
                  <CollapsibleTrigger className="cursor-pointer">
                    {/* <House className="mr-2" strokeWidth={2.5} /> */}
                    <div className="flex gap-1 items-center text-white ">
                      {item.icon}
                      {item.title}
                    </div>
                    <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90 text-white group-data-[state=open]:text-primary-foreground" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>

                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {item.items?.map((child) => {
                        const isActive = pathname === child.url;

                        return (
                          <SidebarMenuItem key={child.title} className="ml-6">
                            <SidebarMenuButton
                              asChild
                              className={
                                isActive
                                  ? " text-primary-foreground font-semibold"
                                  : "text-white"
                              }
                            >
                              <Link href={child.url}>{child.title}</Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          );
        })}
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
