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
import useGetPropertiesList from "@/lib/services/hooks/useGetProperties";
import { Separator } from "@/components/ui/separator";
import CreateExpenses from "./CreateExpenses";
import CreateUnit from "./CreateUnit";
import ViewUnit from "./ViewUnit";
// import CreateInvoice from "./CreateInvoice";
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
type expenses = {
  expenses_no: string;
  tenancy: string;
  type: string;
  status: string;
  p_status: string;
  bill_to: string;
  date: string;
  amount: string;
  property: string;
};
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
  const invoiceColumns: Column<expenses>[] = [
    {
      title: "Unit No",
      key: "expenses_no",
      sortable: true,
      className: "pl-6 py-4",
      render: (order) => (
        <div className="pl-4 text-primary font-medium ">
          {/* {order.expenses_no ?? "-"} */}
          <ViewUnit />
        </div>
      ),
    },
    {
      title: "Unit Name",
      key: "tenancy",
      sortable: true,
      render: (user) => <div>{user.tenancy}</div>,
    },
    {
      title: "Status",
      key: "status",
      sortable: true,
    },
  ];
  const filters = [
    <InputWithIcon
      key="invoice_no"
      icon={Search}
      placeholder="Invoice Number"
    />,
    <InputWithIcon
      key="tenancy_code"
      icon={Search}
      placeholder="Tenancy Code"
    />,
    <InputWithIcon
      key="bill_to_name"
      icon={Search}
      placeholder="Bill To Name"
    />,
    <InputWithIcon
      key="property_name"
      icon={Search}
      placeholder="Property Name"
    />,
    <InputWithIcon key="date_range" icon={Calendar} placeholder="Date Range" />,
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
    unit: "-", // Replace with actual unit info if available
    room: "-", // Replace with actual room info if available
    smart_home: "-", // Replace with actual smart home info if available
    owner_name: "-", // Replace with actual owner name if available
    rental: "-", // Replace with actual rental info if available
    tenancy: "-", // Replace with actual tenancy info if available
    status: "-", // Replace with actual status if available
  }));

  return (
    <div>
      <HeaderPage title="#28139819031231" />
      <div className="w-full mt-5 rounded-[6px] p-3 bg-white">
        {/* <ResponsiveFilter filters={filters} actionButton={actionButton} /> */}
        {/* Actions */}
        <div className="flex w-full justify-end my-3">
          <div className="flex flex-wrap space-x-3">
            {/* <Button className="rounded-[6px] text-white ">
              Create New Expenses
            </Button> */}
            <CreateUnit />
          </div>
        </div>

        <div className="flex items-end justify-end">
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
        <Datatable<expenses>
          columns={invoiceColumns}
          data={[
            {
              expenses_no: "EXP-0001",
              tenancy: "TEN-001",
              type: "Utilities",
              status: "Paid",
              p_status: "Posted",
              bill_to: "John Doe",
              date: "2024-06-01",
              amount: "1500.00",
              property: "Sky Residence Punching",
            },
          ]}
          isPending={isLoading}
          pagination={pagination}
          setPagination={setPagination}
          rowKey={(item: expenses) => item.expenses_no}
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
