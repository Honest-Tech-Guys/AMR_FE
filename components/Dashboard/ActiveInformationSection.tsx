"use client";
import RealStateIcon from "@/lib/icons/RealStateIcon";
import RenterIcon from "@/lib/icons/RenterIcon";
import RoomsIcon from "@/lib/icons/RoomsIcon";
import UnitsIcons from "@/lib/icons/UnitsIcons";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import React from "react";

type ActiveInformationSectionProps = {
  general: {
    active_tenancies: number;
    properties: number;
    units: number;
    rooms: number;
  };
};

const ActiveInformationSection: React.FC<ActiveInformationSectionProps> = ({
  general,
}) => {
  const oneSlider = [
    {
      label: "Active Tenancies",
      value: general.active_tenancies,
      icon: <RenterIcon />,
    },
    { label: "Properties", value: general.properties, icon: <RealStateIcon /> },
    { label: "Units", value: general.units, icon: <UnitsIcons /> },
    { label: "Rooms", value: general.rooms, icon: <RoomsIcon /> },
  ];
  const router = useRouter();
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 w-full gap-5 ">
      {oneSlider.map((item, index) => (
        <div
          key={index}
          className={cn(
            "flex items-end justify-between shadow-xs bg-white w-full rounded-[10px] text-black/85 py-2 px-5",
            item.label === "Units" || item.label === "Rooms"
              ? ""
              : "cursor-pointer"
          )}
          onClick={() => {
            item.label === "Properties"
              ? router.push(`/property/list-view`)
              : null;
            item.label === "Active Tenancies"
              ? router.push(`/tenancy?status=Active`)
              : null;
          }}
        >
          <div>
            <h3 className="text-[15px] font-semibold">{item.label}</h3>
            <h3 className="text-[15px] font-semibold">{item.value}</h3>
            <h3
              className={cn(
                "text-primary-foreground text-xs",
                item.label === "Units" || item.label === "Rooms"
                  ? "invisible"
                  : ""
              )}
            >
              {"View"}
            </h3>
          </div>
          <div className="bg-gray-100 p-2 rounded-[15px]">{item.icon}</div>
        </div>
      ))}
    </div>
  );
};

export default ActiveInformationSection;
