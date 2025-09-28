"use client";
import React, { useState, useEffect } from "react";
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
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Function to toggle fullscreen
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        // Enter fullscreen
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        // Exit fullscreen
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error("Error toggling fullscreen:", error);
    }
  };

  // Listen for fullscreen changes (including ESC key)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);
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
        <Scan
          onClick={toggleFullscreen}
          className="size-5 text-primary cursor-pointer hover:opacity-70 transition-opacity"
          strokeWidth={2.5}
        />
        <NotificationPopover />
        <LogOut
          onClick={logout}
          className="size-5 text-primary cursor-pointer"
          strokeWidth={2.5}
        />
        <Avatar>
          <AvatarImage src={data?.avatar_url} alt="@shadcn" />
          <AvatarFallback className="bg-primary/10">
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
