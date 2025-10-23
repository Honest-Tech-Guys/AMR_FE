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
      title: "Expenses",
      key: "expenses_no",
      sortable: true,
      className: "pl-6 py-4",
      render: (order) => (
        <div className="pl-4 text-primary font-medium ">
          {order.expenses_no ?? "-"}
        </div>
      ),
    },
    {
      title: "Tenancy",
      key: "tenancy",
      sortable: true,
      render: (user) => <div>{user.tenancy}</div>,
    },
    {
      title: "Status",
      key: "status",
      sortable: true,
    },
    {
      title: "P Status",
      key: "p_status",
      render: (order) => <div>{order.p_status}</div>,
    },
    {
      title: "Bill To",
      key: "bill_to",
      render: (order) => <div>{order.bill_to}</div>,
    },
    {
      title: "Date",
      key: "date",
      render: (order) => <div>{order.date}</div>,
    },
    {
      title: "Amount",
      key: "amount",
      render: (order) => <div>{order.amount ?? "-"}</div>,
    },
    {
      title: "Property",
      key: "property",
      render: (order) => <div>{order.property}</div>,
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

  // const { data, isLoading, error } = useGetPropertiesList();

  // // Map API data to table format
  // const tableData = (data || []).map((item) => ({
  //   property_id: item.property_name ?? "-",
  //   unit: "-", // Replace with actual unit info if available
  //   room: "-", // Replace with actual room info if available
  //   smart_home: "-", // Replace with actual smart home info if available
  //   owner_name: "-", // Replace with actual owner name if available
  //   rental: "-", // Replace with actual rental info if available
  //   tenancy: "-", // Replace with actual tenancy info if available
  //   status: "-", // Replace with actual status if available
  // }));
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
      <HeaderPage title="Expenses" />
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
        />
        {/* Actions */}
        <div className="flex w-full justify-end my-3">
          <div className="flex flex-wrap space-x-3">
            {/* <Button className="rounded-[6px] text-white ">
              Create New Expenses
            </Button> */}
            <CreateExpenses />
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
          isPending={false}
          pagination={pagination}
          setPagination={setPagination}
          rowKey={(item: expenses) => item.expenses_no}
          // isFilter={isFilter}
        />
        {/* {error && (
          <div className="text-red-500 mt-2">Error loading properties.</div>
        )} */}
      </div>
      {/* <MapWithPoints /> */}
    </div>
  );
};

export default Page;
