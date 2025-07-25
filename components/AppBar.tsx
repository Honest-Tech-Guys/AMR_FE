"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { ChevronRight, House } from "lucide-react";
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

// Menu configuration
const menuItems = [
  { title: "Dashboard", url: "/", icon: <RenterIcon /> },
  {
    title: "Property",
    items: [
      { title: "List View", url: "/property/list-view" },
      { title: "Grid View", url: "/property/grid-view" },
    ],
  },
  {
    title: "Tenancy",
    items: [{ title: "Tenant", url: "/tenancy/tenant" }],
  },
  {
    title: "Booking",
    items: [
      { title: "List View", url: "/booking/list-view" },
      { title: "Grid View", url: "/booking/grid-view" },
      { title: "Property Setting", url: "/booking/property-setting" },
      { title: "Booking Setting", url: "/booking/booking-setting" },
    ],
  },
  {
    title: "Smart Home",
    items: [
      { title: "Meter", url: "/smart-home/meter" },
      { title: "Lock", url: "/smart-home/lock" },
    ],
  },
  {
    title: "Payout",
    items: [
      { title: "Pending", url: "/payout/pending" },
      { title: "Generated", url: "/payout/generated" },
    ],
  },
  {
    title: "People",
    items: [
      { title: "Tenant", url: "/people/tenant" },
      { title: "Owner", url: "/people/owner" },
    ],
  },
  {
    title: "Accounting",
    items: [
      { title: "Invoice", url: "/accounting/invoice" },
      { title: "Expenses", url: "/accounting/expenses" },
      { title: "Settlement", url: "/accounting/settlement" },
      { title: "Daily Report", url: "/accounting/daily-report" },
      { title: "Auto Collection", url: "/accounting/auto-collection" },
    ],
  },
  { title: "Notifications", url: "/notifications" },
  {
    title: "Reports",
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex justify-center items-center">
          <img src="/Logo.png" alt="Logo" width={204} height={71} />
        </div>
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
                          ? "bg-primary-foreground/8 border-l-3 border-primary-foreground  py-5 text-primary-foreground rounded-sm hover:bg-primary-foreground hover:text-white"
                          : "font-semibold py-5 rounded-sm hover:bg-primary-foreground hover:text-white "
                      }
                    >
                      <a href={item.url}>
                        <House strokeWidth={2.5} />

                        {item.title}
                      </a>
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
                  className={`group/label text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
                    isChildActive
                      ? "bg-primary-foreground/8 border-l-3 border-primary-foreground  py-5 text-primary-foreground rounded-sm hover:bg-primary-foreground hover:text-white"
                      : "text-sidebar-foreground py-5 rounded-sm hover:bg-primary-foreground hover:text-white "
                  }`}
                >
                  <CollapsibleTrigger className="cursor-pointer">
                    <House className="mr-2" strokeWidth={2.5} />
                    {item.title}
                    <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
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
                                isActive ? " text-primary font-semibold" : ""
                              }
                            >
                              <a href={child.url}>{child.title}</a>
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
