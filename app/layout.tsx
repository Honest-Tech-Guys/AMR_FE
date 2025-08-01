"use client";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { useAuthStore } from "@/lib/stores/authStore";
import Login from "./Login/Login";
import { AppSidebar } from "@/components/AppBar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, LogOut, Scan, Search } from "lucide-react";
import ReactQueryProvider from "@/lib/ReactQueryProvider";
import { Input } from "@/components/ui/input";
import { InputWithIcon } from "@/components/InpuWithIcon";
import { Toaster } from "sonner";

// Fonts
// const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// ✅ Child layout component that can use `useSidebar` safely
function LayoutShell({ children }: { children: React.ReactNode }) {
  const { logout } = useAuthStore();
  return (
    <>
      <AppSidebar />
      <SidebarInset className="bg-gray-100 ">
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
            <Bell className="size-5 text-primary" strokeWidth={2.5} />
            <LogOut
              onClick={logout}
              className="size-5 text-primary"
              strokeWidth={2.5}
            />
            <Avatar>
              <AvatarImage src="/testImage.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <span className="tracking-tight">Johanson</span>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuth } = useAuthStore();

  return (
    <html lang="en">
      <body className={` antialiased`}>
        <ReactQueryProvider>
          <Toaster position="top-right" />
          {isAuth ? (
            <Login />
          ) : (
            <SidebarProvider>
              <LayoutShell>{children}</LayoutShell>
            </SidebarProvider>
          )}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
