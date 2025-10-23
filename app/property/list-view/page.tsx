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
import { ReactNode, useEffect, useState } from "react";
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
import CreateBulkPropertyModal from "./CreateBulkPropertyModal";
import { Property } from "@/types/PropertyType";

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

// const options = [
//   {
//     value: "all",
//     label: "ALL",
//     count: "",
//   },
//   {
//     value: "Vacant",
//     label: "Vacant ",
//     count: "50",
//   },
//   {
//     value: "Occupied",
//     label: "Occupied ",
//     count: "50",
//   },
//   {
//     value: "Deactivated ",
//     label: "Deactivated ",
//     count: "50",
//   },
// ];

interface PaginationData {
  page: number;
  per_page: number;
  last_page?: number;
  links?: {
    active: boolean;
    url: string | null;
    label: string;
  }[];
}

const Page = () => {
  const [options, setOptions] = useState([
    {
      value: "",
      label: "ALL",
      count: "",
    },
    {
      value: "Vacant",
      label: "Vacant ",
      count: "",
    },
    {
      value: "Fully Occupied",
      label: "Fully Occupied ",
      count: "",
    },
    {
      value: "Partially Occupied",
      label: "Partially Occupied",
      count: "",
    },
    {
      value: "Deactivated",
      label: "Deactivated",
      count: "",
    },
  ]);
  const router = useRouter();
  const [isFilter, setIsFilter] = useState(false);
  const [actionIsOpen, setActionsIsOpen] = useState(false);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    per_page: 10,
    last_page: 1,
    links: [],
  });
  const [openView, setOpenView] = useState(false);
  const propertyColumns: Column<Property>[] = [
    {
      title: "Property",
      key: "property_name",
      sortable: true,
      className: "pl-6 py-4",
      render: (property) => (
        <div key={property.id}>
          <div
            className="pl-4 text-primary font-medium cursor-pointer"
            onClick={() => setOpenView(true)}
          >
            {property.property_name}
          </div>
          <EditProperty
            onOpenChange={setOpenView}
            open={openView}
            property={property}
          />
        </div>
      ),
    },
    {
      title: "Type",
      key: "property_type",
      sortable: true,
      render: (property) => <div>{property.property_type}</div>,
    },
    {
      title: "Owner",
      key: "owner.name",
      sortable: true,
      render: (property) => <div>{property.owner.name}</div>,
    },
    {
      title: "Address",
      key: "city",
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
  const [formFilters, setFormFilters] = useState({
    property_name: "",
    unit_name: "",
    rental_type: "",
    Meter_and_lock: "",
    data_range: "",
    status: "",
    page: "1",
    per_page: "10",
  });

  const [appliedFilters, setAppliedFilters] = useState({});
  const { data, isLoading, error } = useGetPropertiesList(appliedFilters);
  useEffect(() => {
    if (data) {
      setPagination((prev) => ({
        ...prev,
        page: data?.properties.current_page ?? prev.page,
        per_page: data?.properties.per_page ?? prev.per_page,
        last_page: data?.properties.last_page ?? prev.last_page,
        links: data?.properties.links ?? prev.links,
      }));
      setOptions([
        {
          value: "",
          label: "ALL",
          count: "",
        },
        {
          value: "Vacant",
          label: "Vacant ",
          count: `${data.counters.Vacant}`,
        },
        {
          value: "Fully Occupied",
          label: "Fully Occupied ",
          count: `${data.counters["Fully Occupied"]}`,
        },
        {
          value: "Partially Occupied ",
          label: "Partially Occupied ",
          count: `${data.counters["Partially Occupied"]}`,
        },
        {
          value: "Deactivated",
          label: "Deactivated",
          count: `${data.counters["Deactivated"]}`,
        },
      ]);
    }
  }, [data]);
  useEffect(() => {
    setAppliedFilters({
      ...formFilters,
      page: pagination.page.toString(),
      per_page: pagination.per_page.toString(),
    });
  }, [pagination.page, pagination.per_page]);
  // Map API data to table format
  const tableData: Property[] =
    data?.properties.data.map((item: Property) => item) ?? [];

  return (
    <div>
      <HeaderPage title="Property" />
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
              onClick={() => setAppliedFilters(formFilters)}
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
            <CreateBulkPropertyModal />
            <CreateNewProperty />
          </div>
        </div>
        <div className="flex items-end justify-between">
          <RadioCardsDemo
            options={options}
            value={(appliedFilters as { status?: string })?.status || ""}
            onChange={(val) =>
              setAppliedFilters((prev) => ({ ...prev, status: val }))
            }
          />
          {/* <div className=" flex justify-end">
            <Button
              variant="outline"
              onClick={() => setIsFilter((prev) => !prev)}
              className="rounded-[6px] h-6 m-0 cursor-pointer"
            >
              <Funnel className="mr-2" />
              Fast Filter {isFilter ? <ChevronUp /> : <ChevronDown />}
            </Button>
          </div> */}
        </div>
        <Datatable<Property>
          columns={propertyColumns}
          data={tableData}
          isPending={isLoading}
          pagination={pagination}
          setPagination={setPagination}
          rowKey={(item: Property) => item.id}
          // isFilter={isFilter}
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
