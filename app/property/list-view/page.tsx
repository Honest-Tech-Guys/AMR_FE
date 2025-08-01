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
import { useRouter } from "next/navigation";
import CreateNewProperty from "./CreateNewProperty";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditProperty from "./Actions/EditProperty";
import CreateUnit from "./Actions/CreateUnit";
import CreateTenancy from "./Actions/CreateTenancy";
import CreateMeter from "./Actions/CreateMeter";
import CreateEquipment from "./Actions/CreateEquipment";
import MapWithPoints from "@/components/ImageMapper";
import CreateInvoice from "./Actions/CreateInvoice";
import useGetPropertiesList from "@/lib/services/hooks/useGetProperties";
import { PropertyType } from "@/types/PropertyType";
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
// type property = {
//   property_id: string;
//   unit: string;
//   room: string;
//   smart_home: string;
//   owner_name: string;
//   rental: string;
//   tenancy: string;
//   status: string;
// };
interface PaginationData {
  page: number;
  per_page: number;
}

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

const Page = () => {
  const router = useRouter();
  const [isFilter, setIsFilter] = useState(false);
  const [actionIsOpen, setActionsIsOpen] = useState(false);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    per_page: 10,
  });
  const invoiceColumns: Column<PropertyTableData>[] = [
    {
      title: "Property",
      key: "Property_id",
      sortable: true,
      className: "pl-6 py-4",
      render: (order) => (
        <div className="pl-4 text-primary font-medium ">
          {order.property_id ?? "-"}
        </div>
      ),
    },
    {
      title: "Unit",
      key: "unit",
      sortable: true,
      render: (user) => <div>{user.unit}</div>,
    },
    {
      title: "Status",
      key: "status",
      sortable: true,
    },
    {
      title: "Room",
      key: "room",
      render: (order) => <div>{order.room}</div>,
    },
    {
      title: "Smart Home",
      key: "smart_home",
      render: (order) => <div>{order.smart_home}</div>,
    },
    {
      title: "Owner Name",
      key: "owner_name",
      render: (order) => <div>{order.owner_name}</div>,
    },
    {
      title: "Rental",
      key: "rental",
      render: (order) => <div>{order.rental}</div>,
    },
    {
      title: "Tenancy",
      key: "tenancy",
      render: (order) => <div>{order.tenancy}</div>,
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
                <EditProperty property={order.originalData} />
              </DropdownMenuItem>
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

  const { data, isLoading, error } = useGetPropertiesList();

  // Map API data to table format
  const tableData = (data || []).map((item) => ({
    property_id: item.property_name ?? "-",
    unit: item.property_type ?? "-",
    room: item.facilities?.length ? item.facilities.join(", ") : "-",
    smart_home:
      item.facilities?.includes("meeting_room") ||
      item.facilities?.includes("game_room")
        ? "Yes"
        : "No",
    owner_name: item.attention_name ?? "-",
    rental: item.address_line_1 ? `${item.address_line_1}, ${item.city}` : "-",
    tenancy: `${item.city}, ${item.state}`,
    status: item.remarks || "Active",
    originalData: item, // Store the original item for actions
  }));

  return (
    <div>
      <HeaderPage title="Property" />
      <div className="w-full mt-5 rounded-[6px] p-3 bg-white">
        <ResponsiveFilter filters={filters} actionButton={actionButton} />
        {/* Actions */}
        <div className="flex w-full justify-end my-3">
          <div className="flex flex-wrap space-x-3">
            <Button className="bg-black rounded-[6px] text-white hover:bg-black/70">
              Create Bulk Property
            </Button>
            <CreateNewProperty />
          </div>
        </div>
        <div className="flex items-end justify-between">
          <RadioCardsDemo options={options} />
          <div className=" flex justify-end">
            <Button
              variant="outline"
              onClick={() => setIsFilter((prev) => !prev)}
              className="rounded-[6px] h-6 m-0"
            >
              <Funnel className="mr-2" />
              Fast Filter {isFilter ? <ChevronUp /> : <ChevronDown />}
            </Button>
          </div>
        </div>
        <Datatable<PropertyTableData>
          columns={invoiceColumns}
          data={tableData}
          isPending={isLoading}
          pagination={pagination}
          setPagination={setPagination}
          rowKey={(item: PropertyTableData) => item.property_id}
          isFilter={isFilter}
        />
        {error && (
          <div className="text-red-500 mt-2">Error loading properties.</div>
        )}
      </div>
      {/* <MapWithPoints /> */}
    </div>
  );
};

export default Page;
