"use client";
import HeaderPage from "@/components/HeaderPage";
import { InputWithIcon } from "@/components/InpuWithIcon";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Ellipsis,
  Funnel,
  Gauge,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResponsiveFilter } from "@/components/responsive-filter";
import RadioCardsDemo from "@/components/RaidoTab";
import Datatable, { Column } from "@/components/datatable";
import { ReactNode, useState } from "react";
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
import PropertyDropdown from "../grid-view/PropertyDropDown";

// Import Property type
// type Property = {
//   id: number;
//   property_name: string;
//   property_type: string;
//   status: string;
//   owner_id: number;
//   created_by: number;
//   contact_name: string;
//   contact_phone: string;
//   remarks: string;
//   address_line_1: string;
//   city: string;
//   postcode: string;
//   state: string;
//   country: string;
//   facilities: string[];
//   created_at: string;
//   updated_at: string;
//   owner: { id: number; name: string };
//   creator: { id: number; name: string };
//   units: any[];
// };

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

interface PaginationData {
  page: number;
  per_page: number;
}

interface PropertyTableData {
  property_id: string;
  unit: string;
  room: string;
  smart_home: ReactNode;
  owner_name: string;
  rental: string;
  tenancy: {
    tenantName: string;
    period: string;
    autoPay: boolean;
    countdown: string;
  };
  status: string;
  // Include the original PropertyType for actions
  originalData: Property;
}

const Page = () => {
  const router = useRouter();
  const [isFilter, setIsFilter] = useState(false);
  const [actionIsOpen, setActionsIsOpen] = useState(false);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    per_page: 10,
  });
  const [openView, setOpenView] = useState(false);
  const propertyColumns: Column<Property>[] = [
    {
      title: "Property",
      key: "Property_id",
      sortable: true,
      className: "pl-6 py-4",
      render: (property) => (
        <div
          className="pl-4 text-primary font-medium cursor-pointer "
          onClick={() => {
            setOpenView(!openView);
          }}
        >
          {property.property_name}
          {/* <EditProperty
            property={property}
            open={openView}
            onOpenChange={setOpenView}
          /> */}
        </div>
      ),
    },
    {
      title: "Type",
      key: "type",
      sortable: true,
      render: (property) => <div>{property.property_type}</div>,
    },
    {
      title: "Owner",
      key: "owner",
      sortable: true,
      render: (property) => <div>{property.owner.name}</div>,
    },
    {
      title: "Address",
      key: "address",
      render: (property) => (
        <div>
          {property.city},{property.state},{property.address_line_1}
        </div>
      ),
    },
    {
      title: "Facilities",
      key: "facilities",
      render: (property) => (
        <div>
          {property.facilities
            ?.map((f: string) =>
              f
                .split("_")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")
            )
            .join(", ")}
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (order) => (
        <div>
          {" "}
          <PropertyDropdown property={order} />
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
  const tableData: Property[] = (data || []).map((item: Property) => item);

  return (
    <div>
      <HeaderPage title="Property" />
      <div className="w-full mt-5 rounded-[6px] p-3 bg-white">
        <ResponsiveFilter filters={filters} actionButton={actionButton} />
        {/* Actions */}
        <div className="flex w-full justify-end my-3">
          <div className="flex flex-wrap space-x-3">
            <Button className="bg-black rounded-[6px] text-white hover:bg-black/70 cursor-pointer">
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
              className="rounded-[6px] h-6 m-0 cursor-pointer"
            >
              <Funnel className="mr-2" />
              Fast Filter {isFilter ? <ChevronUp /> : <ChevronDown />}
            </Button>
          </div>
        </div>
        <Datatable<Property>
          columns={propertyColumns}
          data={tableData}
          isPending={isLoading}
          pagination={pagination}
          setPagination={setPagination}
          rowKey={(item: Property) => item.id}
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
