"use client";

import { Home, Heart, BarChart2, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const BottomNav = () => {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", icon: <Home size={22} />, path: "/" },
    {
      name: "Agreement",
      icon: <Heart size={22} />,
      path: "/tenancy/Agreement",
    },
    { name: "Smart Home", icon: <BarChart2 size={22} />, path: "/smart-home" },
    { name: "Profile", icon: <User size={22} />, path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-sm">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.path}
            className={`flex flex-col items-center justify-center text-xs ${
              pathname === item.path
                ? "text-green-700 font-medium"
                : "text-gray-500"
            }`}
          >
            {item.icon}
            <span className="mt-1">{item.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
