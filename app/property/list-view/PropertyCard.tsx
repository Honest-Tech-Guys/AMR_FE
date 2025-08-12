import React from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PropertyType } from "@/types/PropertyType";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";
import router from "next/router";
import CreateEquipment from "./Actions/CreateEquipment";
import CreateInvoice from "./Actions/CreateInvoice";
import CreateMeter from "./Actions/CreateMeter";
import CreateTenancy from "./Actions/CreateTenancy";
import EditProperty from "./Actions/EditProperty";
interface PropertyTableData {
  property_id: string;
  unit: string;
  room: string;
  smart_home: string;
  owner_name: string;
  rental: string;
  tenancy: string;
  status: string;
  // Include the original PropertyType for actions
  originalData: PropertyType;
}
interface Props {
  data: PropertyTableData[];
}
const PropertyCard = ({ data }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((property) => (
        <div
          key={property.property_id}
          className="border rounded-2xl p-4 hover:shadow-md transition-shadow"
        >
          <p className="flex items-center gap-2">
            <Badge className="text-[#F6FFED] bg-[#52C41A] font-normal border-[#B7EB8F]">
              {property.status}
            </Badge>
            <Badge className="bg-gray-100 text-black font-normal border-1">
              {property.smart_home === "Yes" ? "Smart Home" : "Standard"}
            </Badge>
          </p>
          <p className="text-sm text-gray-600 mt-2">
            <span className="font-medium">Property</span>
            <span className="font-bold text-lg ml-2">
              {property.property_id}
            </span>
          </p>
          <div className="mt-3 space-y-2">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Unit:</span> {property.unit}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Room:</span> {property.room}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Owner:</span> {property.owner_name}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Rental:</span> {property.rental}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Tenancy:</span> {property.tenancy}
            </p>
          </div>
          <Separator className="my-5" />
          <div className="flex justify-center text-sm font-normal text-primary">
            {/* You can add actions here, e.g. <ViewProperty property={property} /> */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="">
                <Button className="rounded-md text-white cursor-pointer">
                  View Details
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {/* <DropdownMenuItem
                  className="hover:bg-gray-100 hover:cursor-pointer"
                  onSelect={(e) => {
                    e.preventDefault();
                  }}
                >
                  <EditProperty property={property} />
                </DropdownMenuItem> */}
                <DropdownMenuItem
                  className="hover:bg-gray-100 hover:cursor-pointer"
                  onSelect={(e) => {
                    e.preventDefault();
                    router.push("/unit");
                  }}
                >
                  {/* <CreateUnit /> */}Add Unit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="hover:bg-gray-100 hover:cursor-pointer"
                  onSelect={(e) => {
                    e.preventDefault();
                  }}
                >
                  <CreateTenancy />
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="hover:bg-gray-100 hover:cursor-pointer"
                  onSelect={(e) => {
                    e.preventDefault();
                  }}
                >
                  <CreateMeter />
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="hover:bg-gray-100 hover:cursor-pointer"
                  onSelect={(e) => {
                    e.preventDefault();
                  }}
                >
                  <CreateInvoice />
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="hover:bg-gray-100 hover:cursor-pointer"
                  onClick={() => {}}
                >
                  Add Lock
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="hover:bg-gray-100 hover:cursor-pointer"
                  onSelect={(e) => {
                    e.preventDefault();
                  }}
                >
                  <CreateEquipment />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PropertyCard;
