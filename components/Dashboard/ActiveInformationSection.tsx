import RealStateIcon from "@/lib/icons/RealStateIcon";
import RenterIcon from "@/lib/icons/RenterIcon";
import RoomsIcon from "@/lib/icons/RoomsIcon";
import UnitsIcons from "@/lib/icons/UnitsIcons";
import React from "react";

const ActiveInformationSection = () => {
  const oneSlider = [
    { label: "Active Tenancies", value: 429, icon: <RenterIcon /> },
    { label: "Properties", value: 25, icon: <RealStateIcon /> },
    { label: "Units", value: 60, icon: <UnitsIcons /> },
    { label: "Rooms", value: 200, icon: <RoomsIcon /> },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-4  w-full   gap-5">
      {oneSlider.map((item, index) => (
        <div
          key={index}
          className="flex items-end justify-between shadow-xs bg-white w-full rounded-[10px] text-black/85 p-5"
        >
          <div>
            <h3 className="text-[12px] font-semibold">{item.label}</h3>
            <h3 className="text-sm font-semibold">{item.value}</h3>
            <h3 className="text-primary-foreground text-xs">{"View"}</h3>
          </div>
          <div className="bg-gray-100 p-2 rounded-[15px]">{item.icon}</div>
        </div>
      ))}
    </div>
  );
};

export default ActiveInformationSection;
