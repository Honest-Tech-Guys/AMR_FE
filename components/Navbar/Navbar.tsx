"use client";
import React from "react";
import { SidebarTrigger } from "../ui/sidebar";
import { Bell, LogOut, Scan, Search } from "lucide-react";
import { InputWithIcon } from "@/components/InpuWithIcon";

import { useAuthStore } from "@/lib/stores/authStore";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import useGetUser from "@/lib/services/hooks/useGetUser";
import { NotificationPopover } from "./NotificationPopover";
const Navbar = () => {
  const { logout } = useAuthStore();
  const { data } = useGetUser();
  return (
    <header className="bg-background sticky z-1 top-0 flex h-12 shrink-0 items-center ml-1  gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <InputWithIcon
        key="search"
        icon={Search}
        placeholder="Search..."
        className="max-w-50"
      />
      <div className="flex gap-3 items-center justify-end w-full">
        <Scan className="size-5 text-primary" strokeWidth={2.5} />
        <NotificationPopover />
        <LogOut
          onClick={logout}
          className="size-5 text-primary cursor-pointer"
          strokeWidth={2.5}
        />
        <Avatar>
          <AvatarImage src={data?.avatar_url} alt="@shadcn" />
          <AvatarFallback>
            {data?.name[0]}
            {data?.name[1]}
          </AvatarFallback>
        </Avatar>
        <span className="tracking-tight">{data?.name}</span>
      </div>
    </header>
  );
};

export default Navbar;
