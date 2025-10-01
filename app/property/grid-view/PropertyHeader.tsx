"use client";

import GetPropertyStatusBadge from "@/components/General/GetPropertyStatusBadge";
import { Dot } from "lucide-react";

export default function PropertyHeader({
  property,
  rightSlot,
}: {
  property: any;
  rightSlot?: React.ReactNode;
}) {
  return (
    <div className="w-full flex justify-between">
      <div className="">
        <p className="text-primary hover:underline font-bold z-50 mb-3 cursor-pointer">
          {property.property_name}{" "}
          <GetPropertyStatusBadge status={property.status} />
        </p>
        <p>{`${property.city},${property.address_line_1}`}</p>
        <p className="flex">
          <span>{property.property_type}</span>
          <Dot />
          <span>{property.units.length} Unit</span>
          <Dot />
          <span>
            {property.units.reduce(
              (total: number, unit: any) => total + unit.rooms.length,
              0
            )}{" "}
            Rooms
          </span>
          <Dot />
          <span>
            {property.units.reduce(
              (total: number, unit: any) => total + unit.carparks.length,
              0
            )}{" "}
            Car Parks
          </span>
        </p>
      </div>
      <div>{rightSlot}</div>
    </div>
  );
}

