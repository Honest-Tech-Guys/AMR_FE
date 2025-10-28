"use client";

import { Home, Heart, BarChart2, User, Lock, Gauge, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const BottomNav = () => {
  const pathname = usePathname();
  const [isSmartHomeOpen, setIsSmartHomeOpen] = useState(false);

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
    <>
      {/* Main Bottom Nav */}
      <nav className="fixed md:hidden bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-sm">
        <div className="flex justify-around items-center h-16 max-w-md mx-auto">
          {navItems.map((item) =>
            item.name === "Smart Home" ? (
              <button
                key={item.name}
                onClick={() => setIsSmartHomeOpen(true)}
                className={`flex flex-col items-center justify-center text-xs ${
                  pathname === item.path
                    ? "text-green-700 font-medium"
                    : "text-gray-500"
                }`}
              >
                {item.icon}
                <span className="mt-1">{item.name}</span>
              </button>
            ) : (
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
            )
          )}
        </div>
      </nav>

      {/* Smart Home Popup */}
      {isSmartHomeOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center"
          onClick={() => setIsSmartHomeOpen(false)}
        >
          <div
            className="bg-white w-full max-w-md rounded-t-2xl p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Smart Home</h3>
              <button onClick={() => setIsSmartHomeOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Link
                href="/smart-home/lock"
                className="flex flex-col items-center justify-center border rounded-xl p-4 hover:bg-gray-100"
                onClick={() => setIsSmartHomeOpen(false)}
              >
                <Lock size={28} className="text-emerald-700" />
                <span className="mt-2 text-sm font-medium">Lock</span>
              </Link>
              <Link
                href="/smart-home/meter"
                className="flex flex-col items-center justify-center border rounded-xl p-4 hover:bg-gray-100"
                onClick={() => setIsSmartHomeOpen(false)}
              >
                <Gauge size={28} className="text-emerald-700" />
                <span className="mt-2 text-sm font-medium">Meter</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BottomNav;
