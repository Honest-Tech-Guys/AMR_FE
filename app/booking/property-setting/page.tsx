"use client";
import HeaderPage from "@/components/HeaderPage";
import { InputWithIcon } from "@/components/InpuWithIcon";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  CircleArrowDown,
  CircleArrowUp,
  Funnel,
  PenLine,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResponsiveFilter } from "@/components/responsive-filter";
import RadioCardsDemo from "@/components/RaidoTab";
import Datatable, { Column } from "@/components/datatable";
import { useState } from "react";
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
  room: string;
  vr: string;
  size: string;
  bed_no: string;
  bath_no: string;
  preferred_gender: string;
  cooking_facilities: string;
  fridge: string;
};
interface PaginationData {
  page: number;
  per_page: number;
}
const skyResidencesColumns: Column<property>[] = [
  {
    title: "",
    key: "",
    className: "pl-6 py-4",
    render: () => (
      <div className="pl-4 text-primary font-medium ">
        <CircleArrowUp className="size-4 text-primary" />
      </div>
    ),
  },
  {
    title: "Action",
    key: "action",
    render: () => (
      <div>
        <PenLine className="size-4 text-primary" />
      </div>
    ),
  },
  {
    title: "Unit/Room",
    key: "room",
  },
  {
    title: "VR URL",
    key: "vr",
  },
  {
    title: "Size (SQFT)",
    key: "size",
  },
  {
    title: "No. Bed",
    key: "bed_no",
  },
  {
    title: "No. Bath",
    key: "bath_no",
  },
  {
    title: "Preferred Gender",
    key: "preferred_gender",
  },
  {
    title: "Cooking Facilities",
    key: "cooking_facilities",
  },
  {
    title: "Fridge",
    key: "fridge",
  },
];

const Page = () => {
  const [isOpen1, setIsOpen1] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    per_page: 10,
  });
  const filters = [
    <InputWithIcon key="booking" icon={Search} placeholder="Booking" />,
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
      {/* <HeaderPage title="Property Setting" /> */}
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
        />{" "}
        {/* Actions */}
        <div
          className="flex items-center gap-2 font-medium cursor-pointer"
          onClick={() => {
            setIsOpen1(!isOpen1);
          }}
        >
          <CircleArrowDown className="size-4 text-primary" /> Sky Residences
          Puchong (2)
        </div>
        {isOpen1 && (
          <Datatable<property>
            columns={skyResidencesColumns}
            data={[
              {
                room: "A-101",
                vr: "https://example.com/vr/a-101",
                size: "850",
                bed_no: "2",
                bath_no: "1",
                preferred_gender: "Any",
                cooking_facilities: "Yes",
                fridge: "Yes",
              },
              {
                room: "B-202",
                vr: "https://example.com/vr/b-202",
                size: "950",
                bed_no: "3",
                bath_no: "2",
                preferred_gender: "Female",
                cooking_facilities: "No",
                fridge: "No",
              },
              // ...more items
            ]}
            isPending={false}
            pagination={pagination}
            setPagination={setPagination}
            rowKey={(item: property) => item.room}
            // isFilter={false}
          />
        )}
        <div
          className="flex items-center gap-2 font-medium cursor-pointer"
          onClick={() => {
            setIsOpen2(!isOpen2);
          }}
        >
          <CircleArrowDown className="size-4 text-primary" /> Skypod Puchong (2)
        </div>
        {isOpen2 && (
          <Datatable<property>
            columns={skyResidencesColumns}
            data={[
              {
                room: "A-101",
                vr: "https://example.com/vr/a-101",
                size: "850",
                bed_no: "2",
                bath_no: "1",
                preferred_gender: "Any",
                cooking_facilities: "Yes",
                fridge: "Yes",
              },
              {
                room: "B-202",
                vr: "https://example.com/vr/b-202",
                size: "950",
                bed_no: "3",
                bath_no: "2",
                preferred_gender: "Female",
                cooking_facilities: "No",
                fridge: "No",
              },
              // ...more items
            ]}
            isPending={false}
            pagination={pagination}
            setPagination={setPagination}
            rowKey={(item: property) => item.room}
            // isFilter={false}
          />
        )}
      </div>
    </div>
  );
};

export default Page;
