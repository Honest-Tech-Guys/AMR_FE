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
import CreateNewPayout from "./CreateNewPayout";
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
type payout = {
  posting_date: string;
  pay_to: string;
  invoice_no: string;
  invoice_date: string;
  description: string;
  property: string;
  tenant: string;
  amount: string;
  amount_fee: string;
  action: string;
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
  const invoiceColumns: Column<payout>[] = [
    {
      title: "Posting Date",
      key: "posting_date",
      sortable: true,
      className: "pl-6 py-4",
      render: (order) => (
        <div className="pl-4 text-primary font-medium ">
          {order.posting_date ?? "-"}
        </div>
      ),
    },
    {
      title: "Pay To",
      key: "pay_to",
      sortable: true,
      render: (user) => <div>{user.pay_to}</div>,
    },
    {
      title: "Invoice No",
      key: "invoice_no",
      sortable: true,
    },
    {
      title: "Invoice Date",
      key: "invoice_date",
      render: (order) => <div>{order.invoice_date}</div>,
    },
    {
      title: "Description",
      key: "description",
      render: (order) => <div>{order.description}</div>,
    },
    {
      title: "Property",
      key: "property",
      render: (order) => <div>{order.property}</div>,
    },
    {
      title: "Tenant",
      key: "tenant",
      render: (order) => <div>{order.tenant}</div>,
    },
    {
      title: "Amount",
      key: "amount",
      render: (order) => <div>{order.amount}</div>,
    },
    {
      title: "Amount Fee",
      key: "amount_fee",
      render: (order) => <div>{order.amount_fee}</div>,
    },
    {
      title: "Action",
      key: "action",
      render: (order) => <div>{order.action}</div>,
    },
  ];
  const filters = [
    <InputWithIcon
      key="beneficiary"
      icon={Search}
      placeholder="Beneficiary Name"
    />,
    <InputWithIcon
      key="invoice_start_date"
      icon={Calendar}
      placeholder="Invoice Start Date"
    />,
    <InputWithIcon
      key="invoice_end_date"
      icon={Calendar}
      placeholder="Invoice End Date"
    />,
    <InputWithIcon key="property" icon={Search} placeholder="Property Name" />,
  ];

  const actionButton = (
    <Button key="search" className="rounded-[6px]">
      <Search className="size-4 text-white" strokeWidth={2.5} />
    </Button>
  );

  const { data, isLoading, error } = useGetPropertiesList({});

  // Map API data to table format
  const tableData = data?.properties.data.map((item) => ({
    property_id: item.property_name ?? "-",
    unit: "-", // Replace with actual unit info if available
    room: "-", // Replace with actual room info if available
    smart_home: "-", // Replace with actual smart home info if available
    owner_name: "-", // Replace with actual owner name if available
    rental: "-", // Replace with actual rental info if available
    tenancy: "-", // Replace with actual tenancy info if available
    status: "-", // Replace with actual status if available
  }));
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
      {/* <HeaderPage title="Pending Payout" /> */}
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
        <div className="flex w-full justify-end my-3">
          <div className="flex flex-wrap space-x-3">
            <CreateNewPayout />
          </div>
        </div>

        <Datatable<payout>
          columns={invoiceColumns}
          data={[
            {
              posting_date: "12/15/2024",
              pay_to: "Property Owner",
              invoice_no: "INV-0001",
              invoice_date: "12/15/2024",
              description: "Rental payment",
              property: "Sky Residence Punching",
              tenant: "John Doe",
              amount: "1,500.00",
              amount_fee: "50.00",
              action: "Un-Post",
            },
          ]}
          isPending={isLoading}
          pagination={pagination}
          setPagination={setPagination}
          rowKey={(item: payout) => item.invoice_no}
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
