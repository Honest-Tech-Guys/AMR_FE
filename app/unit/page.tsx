"use client";
import HeaderPage from "@/components/HeaderPage";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreateUnit from "./CreateUnit";
import AddRoomTagging from "./AddRoomTagging";
import AddRoomDetails from "./AddRoomDetails";
import CreateNewTenant from "./CreateNewTenant";
import EditUnit from "./EditUnit";
import useGetUnitsList from "@/lib/services/hooks/useGetUnit";
import { UnitType } from "@/types/UnitType";

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

interface UnitTableData {
  property_id: string;
  unit: string;
  room: string;
  smart_home: string;
  owner_name: string;
  rental: string;
  tenancy: string;
  status: string;
  originalData: UnitType;
}

interface PaginationData {
  page: number;
  per_page: number;
}

const Page = () => {
  const [isFilter, setIsFilter] = useState(false);
  const [actionIsOpen, setActionsIsOpen] = useState(false);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    per_page: 10,
  });

  const { data, isLoading, error } = useGetUnitsList();

  // Map API data to table format
  const tableData = (data || []).map((item) => ({
    property_id: item.property_id ?? "-",
    unit: `${item.block_number} - ${item.unit_number}`,
    room: `${item.bedroom_count} Bed, ${item.bathroom_count} Bath`,
    smart_home: item.is_active === "1" ? "Active" : "Inactive",
    owner_name: item.beneficiary ?? "-",
    rental: item.rental_type ?? "-",
    tenancy: `${item.square_feet} sq ft`,
    status: item.is_active === "1" ? "Active" : "Inactive",
    originalData: item,
  }));
  const invoiceColumns: Column<UnitTableData>[] = [
    {
      title: "#",
      key: "property_id",
      sortable: true,
      className: "pl-6 py-4",
      render: (order) => (
        <div className="pl-4 text-primary font-medium ">
          {order.property_id ?? "-"}
        </div>
      ),
    },
    {
      title: "Name",
      key: "unit",
      sortable: true,
      render: (user) => <div>{user.unit}</div>,
    },

    {
      title: "Tenet Name",
      key: "room",
      render: (order) => <div>{order.room}</div>,
    },
    {
      title: "Status",
      key: "status",
      sortable: true,
    },
    {
      title: "Actions",
      key: "actions",
      render: (order) => (
        <div>
          {" "}
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="">
              <Button variant="ghost" size="icon" className=" h-5">
                <Ellipsis className="text-primary" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="hover:bg-gray-100 hover:cursor-pointer"
                onSelect={(e) => {
                  e.preventDefault();
                }}
              >
                <AddRoomTagging />
              </DropdownMenuItem>
              <DropdownMenuItem
                className="hover:bg-gray-100 hover:cursor-pointer"
                onSelect={(e) => {
                  e.preventDefault();
                }}
              >
                <AddRoomDetails />
              </DropdownMenuItem>
              <DropdownMenuItem
                className="hover:bg-gray-100 hover:cursor-pointer"
                onSelect={(e) => {
                  e.preventDefault();
                }}
              >
                <CreateNewTenant />
              </DropdownMenuItem>
              <DropdownMenuItem
                className="hover:bg-gray-100 hover:cursor-pointer"
                onSelect={(e) => {
                  e.preventDefault();
                }}
              >
                <EditUnit unit={order.originalData} />
              </DropdownMenuItem>
              <DropdownMenuItem
                className="hover:bg-gray-100 hover:cursor-pointer"
                onSelect={(e) => {
                  e.preventDefault();
                }}
              >
                Add Smart Home
              </DropdownMenuItem>
              <DropdownMenuItem
                className="hover:bg-gray-100 hover:cursor-pointer"
                onClick={() => {}}
              >
                Rename Room
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];
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
      <HeaderPage title="View Unit" />
      <Tabs defaultValue="basic">
        <TabsList>
          <TabsTrigger
            className="data-[state=active]:bg-primary rounded-[6px] data-[state=active]:text-white"
            value="basic"
          >
            Basic Information
          </TabsTrigger>
          <TabsTrigger
            className="data-[state=active]:bg-primary rounded-[6px] data-[state=active]:text-white"
            value="room"
          >
            Room
          </TabsTrigger>
        </TabsList>
        <TabsContent value="basic">
          <CreateUnit />
        </TabsContent>
        <TabsContent value="room">
          {" "}
          <div className="flex gap-4 ">
            <MapWithPoints />
            <div className="flex flex-col gap-2 my-5">
              <Button className="rounded-[6px] text-white">Room1</Button>
              <Button className="rounded-[6px] text-white">Room2</Button>
              <Button className="rounded-[6px] text-white">Room3</Button>
            </div>
          </div>
          <div className="w-full mt-5 rounded-[6px] p-3 bg-white">
            <Datatable<UnitTableData>
              columns={invoiceColumns}
              data={tableData}
              isPending={isLoading}
              pagination={pagination}
              setPagination={setPagination}
              rowKey={(item: UnitTableData) => item.property_id}
              isFilter={isFilter}
            />
            {error && (
              <div className="text-red-500 mt-2">Error loading units.</div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Page;
