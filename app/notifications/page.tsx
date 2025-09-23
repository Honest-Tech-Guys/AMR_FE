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
// import CreateMeter from "./CreateMeter";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import ViewNotification from "./ViewNotification";
import CheckRole from "@/lib/CheckRole";
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
  return (
    <div>
      <HeaderPage title="Announcement" />
      <div className="w-full mt-5 rounded-[6px] p-3 bg-white">
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
                { label: "Sublet", value: "Sublet" },
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
        />{" "}
        <div className="grid grid-cols-1 md:grid-cols-3 gpa-5 ">
          <div className=" border rounded-2xl p-3">
            <ViewNotification />
            <p>Title: Water Disruption on 15 June</p>
            <p>Property: Sky Residence Puchong</p>
            <p>
              Status:{" "}
              <Badge className="bg-[#F6FFED] text-[#52C41A] rounded-[6px] border-[#B7EB8F]">
                Active
              </Badge>{" "}
            </p>
            <div className="flex gap-10">
              <div>
                <Label>Notice Start Date</Label>
                <p>05 June 2025</p>
              </div>
              <div>
                <Label>Notice End Date</Label>
                <p>05 June 2025</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <MapWithPoints /> */}
    </div>
  );
};

export default CheckRole(Page, ["admin"]);
