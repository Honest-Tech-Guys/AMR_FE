"use client";
// import { Geist, Geist_Mono } from "next/font/google";
import { AppSidebar } from "@/components/AppBar";
import Navbar from "@/components/Navbar/Navbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import ReactQueryProvider from "@/lib/ReactQueryProvider";
import { useAuthStore } from "@/lib/stores/authStore";
import React from "react";
import { Toaster } from "sonner";
import "./globals.css";
import WelcomePage from "../components/WelcomePage/WelcomePage";
import { usePathname } from "next/navigation";
import AccountVerificationRequiredPage from "@/components/account_verification_required/account_verification_required_page";
// Fonts
// const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// ✅ Child layout component that can use `useSidebar` safely
function LayoutShell({ children }: { children: React.ReactNode }) {
  // e.g. "/dashboard"
  // const searchParams = useSearchParams();

  return (
    <>
      <AppSidebar />
      <SidebarInset className="bg-gray-100 ">
        <Navbar />
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
  const { isAuth, isAuthLoading, checkAuth, email_verified_at } =
    useAuthStore();

  React.useEffect(() => {
    checkAuth();
  }, []);
  const pathname = usePathname();
  return (
    <html lang="en">
      <title>Auntie Michelle Resources (M) SDN.BHD</title>
      <link rel="icon" type="image/ico" href="/Logo.png" />
      <body className="antialiased">
        <ReactQueryProvider>
          <Toaster position="top-right" />
          {isAuthLoading ? null : !isAuth ? (
            <>
              {pathname === "/verify" || pathname === "/failed_verify" ? (
                children
              ) : (
                <WelcomePage />
              )}
            </>
          ) : email_verified_at ? (
            <SidebarProvider>
              <LayoutShell>{children}</LayoutShell>
            </SidebarProvider>
          ) : (
            <AccountVerificationRequiredPage />
          )}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
