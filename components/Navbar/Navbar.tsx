"use client";
import React, { useState, useEffect } from "react";
import { SidebarTrigger } from "../ui/sidebar";
import { Bell, LogOut, Scan, Search } from "lucide-react";
import { InputWithIcon } from "@/components/InpuWithIcon";

import { useAuthStore } from "@/lib/stores/authStore";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import useGetUser from "@/lib/services/hooks/useGetUser";
import { NotificationPopover } from "./NotificationPopover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import UpdateProfile from "./updateProfile";
import TopUp from "./TopUp";

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
  const [openDialog, setOpenDialog] = useState<"editProfile" | "topUp" | null>(
    null
  );
  const MenuItem = ({
    children,
    dialogKey,
  }: {
    children: React.ReactNode;
    dialogKey: typeof openDialog;
  }) => (
    <DropdownMenuItem
      className="hover:bg-gray-100 hover:cursor-pointer"
      onSelect={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setOpenDialog(dialogKey);
      }}
    >
      {children}
    </DropdownMenuItem>
  );
  return (
    <header className="bg-background sticky z-1 top-0 flex h-12 shrink-0 items-center ml-1  gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      {/* <InputWithIcon
        key="search"
        icon={Search}
        placeholder="Search..."
        className="max-w-50"
      /> */}
      <div className="flex items-center w-full gap-3">
        <p className="text-primary">Credit Balance: {data?.user.balance}</p>
        <p
          className="text-primary-foreground text-xs cursor-pointer"
          onClick={() => setOpenDialog("topUp")}
        >
          Top Up
        </p>
      </div>
      <div className="flex gap-3 items-center justify-end w-full">
        <Scan
          onClick={toggleFullscreen}
          className="size-5 text-primary cursor-pointer hover:opacity-70 transition-opacity"
          strokeWidth={2.5}
        />
        <NotificationPopover />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            >
              <Avatar>
                <AvatarImage src={data?.user.avatar_url} alt="@shadcn" />
                <AvatarFallback className="bg-primary/10">
                  {data?.user.name[0]}
                  {data?.user.name[1]}
                </AvatarFallback>
              </Avatar>
              <span className="tracking-tight">{data?.user.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
            <MenuItem dialogKey="editProfile">Edit Profile</MenuItem>
            <MenuItem dialogKey="editProfile">
              <div onClick={logout} className="flex ">
                <LogOut
                  className="size-5 text-primary cursor-pointer"
                  strokeWidth={2.5}
                />{" "}
                Logout
              </div>
            </MenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <UpdateProfile
          open={openDialog === "editProfile"}
          onOpenChange={(open) => setOpenDialog(open ? "editProfile" : null)}
        />
        <TopUp
          balance={data?.user.balance}
          open={openDialog === "topUp"}
          onOpenChange={(open) => setOpenDialog(open ? "topUp" : null)}
        />
      </div>
    </header>
  );
};

export default Navbar;
