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
  User,
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
import { Badge } from "@/components/ui/badge";
import CreateLock from "./CreateLock";
import useGetLocksList from "@/lib/services/hooks/useGetLockList";
import EditLock from "./EditLock";
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
  const { data } = useGetLocksList();
  const [openView, setOpenView] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Locks>();
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
      {/* <HeaderPage title="Lock" /> */}
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
        <div className="flex w-full justify-end my-3">
          <div className="flex flex-wrap space-x-3">
            <CreateLock />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 ">
          {data?.map((lock) => (
            <div className=" border rounded-2xl p-3">
              <label
                className="font-bold text-[#337AB7] cursor-pointer"
                onClick={() => {
                  setOpenView(true);
                  setSelectedItem(lock);
                }}
              >
                {lock.serial_number}
              </label>
              <div>
                <p>Battery: 95</p>
                <p>Gateway: N/H</p>
                <p>Unit Price: RM 0.6</p>
                <p>Property: </p>
                <p>Unit: Block p19</p>
                <p>Room : Room 2 </p>
                <div className="flex gap-1">
                  <User /> 5
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* <MapWithPoints /> */}
      {selectedItem && (
        <EditLock
          lock={selectedItem}
          onOpenChange={setOpenView}
          open={openView}
        />
      )}
    </div>
  );
};

export default Page;
