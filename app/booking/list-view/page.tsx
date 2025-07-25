"use client";
import HeaderPage from "@/components/HeaderPage";
import { InputWithIcon } from "@/components/InpuWithIcon";
import { Calendar, ChevronDown, ChevronUp, Funnel, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResponsiveFilter } from "@/components/responsive-filter";
import RadioCardsDemo from "@/components/RaidoTab";
import Datatable, { Column } from "@/components/datatable";
import { useState } from "react";
import CreateNewBooking from "./CreateNewBooking";
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
  tenant_name: string;
  rental: string;
  rental_frequency: string;
  status: string;
};
interface PaginationData {
  page: number;
  per_page: number;
}
const invoiceColumns: Column<property>[] = [
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
    title: "Room",
    key: "room",
    render: (order) => <div>{order.room}</div>,
  },
  {
    title: "Tenant Name",
    key: "tenant_name",
    render: (order) => <div>{order.tenant_name}</div>,
  },
  {
    title: "Rental",
    key: "rental",
    render: (order) => <div>{order.rental}</div>,
  },
  {
    title: "Rental Frequency",
    key: "rental_frequency",
    render: (order) => <div>{order.rental_frequency}</div>,
  },
  {
    title: "Status",
    key: "status",
    sortable: true,
  },
];

const Page = () => {
  const [isFilter, setIsFilter] = useState(false);
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

  return (
    <div>
      <HeaderPage title="Booking" />
      <div className="w-full mt-5 rounded-[6px] p-3 bg-white">
        <ResponsiveFilter filters={filters} actionButton={actionButton} />
        {/* Actions */}
        <div className="flex w-full justify-end my-3">
          <div className="flex flex-wrap space-x-3">
            <Button className="bg-black rounded-[6px] text-white hover:bg-black/70">
              Create Bulk Booking
            </Button>
            <CreateNewBooking />
          </div>
        </div>
        <div className="flex items-end justify-end">
          {/* <RadioCardsDemo options={options} /> */}
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
        <Datatable<property>
          columns={invoiceColumns}
          data={[]}
          isPending={false}
          pagination={pagination}
          setPagination={setPagination}
          rowKey={(item: property) => item.property_id}
          isFilter={isFilter}
        />
      </div>
    </div>
  );
};

export default Page;
