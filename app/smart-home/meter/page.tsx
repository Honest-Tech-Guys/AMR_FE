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

const meterInfo = [
  { label: "Used Unit", value: 5 },
  { label: "Balance Unit", value: 5 },
  { label: "Unit Price", value: "RM 0.6" },
  { label: "Last Connected At", value: "2025-05-26 19:56:49" },
  { label: "Is Low Balance", value: "No" },
  { label: "Property", value: "Nadayu 801 @ Subang Murni /" },
];

const meterBadges = [{ text: "Wifi Connected" }, { text: "Power On" }];

const Page = () => {
  const [isFilter, setIsFilter] = useState(false);
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

  return (
    <div>
      <HeaderPage title="Meter" />
      <div className="w-full mt-5 rounded-[6px] p-3 bg-white">
        <ResponsiveFilter filters={filters} actionButton={actionButton} />
        {/* Actions */}
        <div className="flex w-full justify-end my-3">
          <div className="flex flex-wrap space-x-3">
            <CreateMeter />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="border rounded-2xl p-3">
            <label className="font-bold text-[#337AB7]">
              19104951173 NDY E-16-11A R3
            </label>
            <div>
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
                      <span>Disconnect</span>
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
              <div className="space-y-1 mt-2">
                {meterInfo.map((item) => (
                  <p key={item.label}>
                    <span className="font-medium">{item.label}:</span>{" "}
                    {item.value}
                  </p>
                ))}
              </div>
              <div className="flex gap-3 mt-3 flex-wrap">
                {meterBadges.map((badge) => (
                  <Badge
                    key={badge.text}
                    className="bg-[#F6FFED] text-[#52C41A] rounded-[6px] border-[#B7EB8F]"
                  >
                    {badge.text}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <MapWithPoints /> */}
    </div>
  );
};

export default Page;
