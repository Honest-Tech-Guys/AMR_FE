"use client";
import HeaderPage from "@/components/HeaderPage";
import { InputWithIcon } from "@/components/InpuWithIcon";
import { ResponsiveFilter } from "@/components/responsive-filter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BrushCleaning,
  Calendar,
  ChartLine,
  ChevronDown,
  CirclePoundSterling,
  Power,
  QrCode,
  RefreshCw,
  Search,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import CreateMeter from "./CreateMeter";
import useGetMetersList from "@/lib/services/hooks/useGetMeterList";
import EditMeter from "./EditMeter";

const Page = () => {
  const { data, isLoading } = useGetMetersList();
  const [isFilter, setIsFilter] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Meter>();
  const [formFilters, setFormFilters] = useState({
    property_name: "",
    unit_name: "",
    rental_type: "",
    Meter_and_lock: "",
    data_range: "",
    status: "all",
    page: "1",
    per_page: "10",
  });

  const filters = [
    <InputWithIcon key="property" icon={Search} placeholder="Property Name" />,
    <InputWithIcon key="unit" icon={Search} placeholder="Unit Name" />,
    <InputWithIcon key="rental" icon={Search} placeholder="Rental Type" />,
    <InputWithIcon key="meter" icon={Search} placeholder="Meter & Lock" />,
    <InputWithIcon key="date" icon={Calendar} placeholder="Date Range" />,
  ];

  const actionButton = (
    <Button key="search" className="rounded-[6px]">
      <Search className="size-4 text-white" strokeWidth={2.5} />
    </Button>
  );

  if (isLoading) {
    return <p>Loading...</p>;
  }
  return (
    <div>
      {/* <HeaderPage title="Meter" /> */}
      <div className="w-full mt-5 mb-10 rounded-[6px] p-3 bg-white">
        <ResponsiveFilter
          filters={[
            {
              name: "property_name",
              placeholder: "Property Name",
              type: "input",
              icon: Search,
            },
            {
              name: "unit_name",
              placeholder: "Unit Name",
              type: "input",
              icon: Search,
            },
            {
              name: "rental_type",
              placeholder: "Rental Type",
              type: "select",
              selectItems: [
                { label: "whole unit", value: "Whole Unit" },
                { label: "Room Rental", value: "Room Rental" },
              ],
              icon: Search,
            },
            {
              name: "Meter_and_lock",
              placeholder: "Meter and Lock",
              type: "input",
              icon: Search,
            },
            {
              name: "date_range",
              placeholder: "Date Range",
              type: "date",
              icon: Calendar,
            },
          ]}
          actionButton={
            <Button
              // onClick={() => setAppliedFilters(formFilters)}
              className="text-white"
            >
              <Search />
            </Button>
          }
          formFilters={formFilters}
          setFormFilters={setFormFilters as never}
        />
        {/* Actions */}
        <div className="flex w-full justify-end my-3">
          <div className="flex flex-wrap space-x-3">
            <CreateMeter />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {data?.map((meter) => (
            <div key={meter.id} className="border rounded-2xl p-3">
              {/* Title */}
              <label
                className="font-bold text-[#337AB7] cursor-pointer"
                onClick={() => {
                  setOpenView(true);
                  setSelectedItem(meter);
                }}
              >
                {meter.name}
              </label>

              <div>
                {/* Action Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="font-thin text-[#337AB7] border-0 shadow-none hover:bg-transparent cursor-pointer"
                    >
                      Action <ChevronDown className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="start">
                    <DropdownMenuGroup>
                      <DropdownMenuItem className="flex gap-2">
                        <RefreshCw />
                        <span>Sync</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex gap-2">
                        <CirclePoundSterling />
                        <span>Top Up</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex gap-2">
                        <BrushCleaning />
                        <span>Clean Balance</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex gap-2">
                        <Power />
                        <span>
                          {meter.power_status === "on"
                            ? "Disconnect"
                            : "Connect"}
                        </span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex gap-2">
                        <ChartLine />
                        <span>Meter Usage</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex gap-2">
                        <QrCode />
                        <span>Download QR</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Info Section */}
                <div className="space-y-1 mt-2">
                  <p>
                    <span className="font-medium">Used Unit:</span>{" "}
                    {meter.used_unit}
                  </p>
                  <p>
                    <span className="font-medium">Balance Unit:</span>{" "}
                    {meter.balance_unit}
                  </p>
                  <p>
                    <span className="font-medium">Unit Price:</span> RM{" "}
                    {meter.unit_price_per_unit}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span>{" "}
                    {meter.connection_status}
                  </p>
                  <p>
                    <span className="font-medium">Property:</span>{" "}
                    {meter.meterable?.property_name}
                  </p>
                </div>

                {/* Badges */}
                <div className="flex gap-3 mt-3 flex-wrap">
                  {meter.connection_status === "online" && (
                    <Badge className="bg-[#F6FFED] text-[#52C41A] rounded-[6px] border-[#B7EB8F]">
                      Wifi Connected
                    </Badge>
                  )}
                  {meter.power_status === "on" && (
                    <Badge className="bg-[#E6F7FF] text-[#1890FF] rounded-[6px] border-[#91D5FF]">
                      Power On
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedItem && (
        <EditMeter
          meter={selectedItem}
          onOpenChange={setOpenView}
          open={openView}
        />
      )}
    </div>
  );
};

export default Page;
