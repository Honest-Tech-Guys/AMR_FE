"use client";
import HeaderPage from "@/components/HeaderPage";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { InputWithIcon } from "@/components/InpuWithIcon";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Ellipsis,
  Funnel,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResponsiveFilter } from "@/components/responsive-filter";
import RadioCardsDemo from "@/components/RaidoTab";
import Datatable, { Column } from "@/components/datatable";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import MapWithPoints from "@/components/ImageMapper";
import useGetPropertiesList from "@/lib/services/hooks/useGetProperties";
import CreateMeter from "./CreateMeter";
import { Badge } from "@/components/ui/badge";
const options = [
  {
    value: "Vacant",
    label: "Vacant (50)",
  },
  {
    value: "Occupied",
    label: "Occupied (32)",
  },
  {
    value: "Deactivated ",
    label: "Deactivated (24)",
  },
];
type property = {
  property_id: string;
  unit: string;
  room: string;
  smart_home: string;
  owner_name: string;
  rental: string;
  tenancy: string;
  status: string;
};
interface PaginationData {
  page: number;
  per_page: number;
}

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
        <div className="grid grid-cols-1 md:grid-cols-3 gpa-5 ">
          <div className=" border rounded-2xl p-3">
            <label className="font-bold text-[#337AB7]">
              19104951173 NDY E-16-11A R3
            </label>
            <Accordion
              type="single"
              collapsible
              className="w-full"
              defaultValue="item-1"
            >
              <AccordionItem value="item-1">
                <AccordionTrigger className="justify-start font-thin text-[#337AB7] hover:no-underline">
                  Action
                </AccordionTrigger>
                <AccordionContent className="flex flex-col  text-balance">
                  <p>Used Unit: 5</p>
                  <p>Balance Unit: 5</p>
                  <p>Unit Price: RM 0.6</p>
                  <p>Last Connected At: 2025-05-26 19:56:49</p>
                  <p>Is Low Balance: No</p>
                  <p>Property: Nadayu 801 @ Subang Murni / </p>
                  <div className="flex gap-3 mt-3 flex-wrap">
                    <Badge className="bg-[#F6FFED] text-[#52C41A] rounded-[6px] border-[#B7EB8F]">
                      Wifi Connected
                    </Badge>
                    <Badge className="bg-[#F6FFED] text-[#52C41A] rounded-[6px] border-[#B7EB8F]">
                      Power On
                    </Badge>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
      {/* <MapWithPoints /> */}
    </div>
  );
};

export default Page;
