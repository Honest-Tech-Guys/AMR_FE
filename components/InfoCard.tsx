import { cn } from "@/lib/utils";
import React from "react";

interface Item {
  title: string;
  value: string | number;
}

interface InfoCardProps {
  title: string;
  items: Item[];
  className?: string; // make optional
}

export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  items,
  className,
}) => {
  return (
    <div className={cn("w-full rounded-sm overflow-hidden shadow-sm")}>
      {/* Header */}
      <div className="px-5 py-3 font-semibold text-black/85 border-b border-gray-300 bg-white">
        {title}
      </div>

      {/* Items Grid */}
      <div
        className={cn("grid w-full gap-px bg-gray-200 grid-cols-2", className)}
      >
        {items.map((item, index) => (
          <div key={index} className="bg-white px-5 py-3">
            <h3 className="text-lg font-semibold">{item.value}</h3>
            <h6 className="text-xs text-gray-500">{item.title}</h6>
          </div>
        ))}
      </div>
    </div>
  );
};
