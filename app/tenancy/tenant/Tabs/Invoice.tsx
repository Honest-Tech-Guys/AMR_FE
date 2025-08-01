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
type invoice = {
  invoice_no: string;
  tenancy: string;
  status: string;
  p_status: string;
  bill_to: string;
  date: string;
  due_date: string;
  amount: string;
  property: string;
};
interface PaginationData {
  page: number;
  per_page: number;
}

const InvoiceTap = () => {
  const [isFilter, setIsFilter] = useState(false);
  const [actionIsOpen, setActionsIsOpen] = useState(false);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    per_page: 10,
  });
  const invoiceColumns: Column<invoice>[] = [
    {
      title: "Invoice",
      key: "invoice_no",
      sortable: true,
      className: "pl-6 py-4",
      render: (order) => (
        <div className="pl-4 text-primary font-medium ">
          {order.invoice_no ?? "-"}
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
      title: "Due Date",
      key: "due_date",
      render: (order) => <div>{order.due_date}</div>,
    },
    {
      title: "Amount",
      key: "amount",
      render: (order) => <div>{order.amount ?? "-"}</div>,
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

  // Map API data to table format

  return (
    <div>
      <div className="w-full  rounded-[6px] p-3 bg-white">
        <span className="font-semibold">Invoice Summary</span>
        <Separator className="mt-3" />
        <div className="grid w-full grid-cols-2 md:grid-cols-4 my-5">
          <div>
            <h2 className="text-xs text-gray-500">Total invoice</h2>
            <h3>RM 3,300 (3)</h3>
          </div>
          <div>
            <h2 className="text-xs text-gray-500">Total Coming Due</h2>
            <h3>RM 3,300 (3)</h3>
          </div>
          <div>
            <h2 className="text-xs text-gray-500">Total Overdue</h2>
            <h3>RM 3,300 (3)</h3>
          </div>
          <div>
            <h2 className="text-xs text-gray-500">Total Paid</h2>
            <h3>RM 3,300 (3)</h3>
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
        <Datatable<invoice>
          columns={invoiceColumns}
          data={[
            {
              invoice_no: "INV-0001",
              tenancy: "TEN-001",
              status: "Paid",
              p_status: "Posted",
              bill_to: "John Doe",
              date: "12/15/2024",
              due_date: "12/30/2024",
              amount: "1,500.00",
              property: "Sky Residence Punching",
            },
            {
              invoice_no: "INV-0002",
              tenancy: "TEN-002",
              status: "Pending",
              p_status: "Draft",
              bill_to: "Jane Smith",
              date: "12/16/2024",
              due_date: "01/15/2025",
              amount: "2,200.00",
              property: "Green Valley Apartments",
            },
            {
              invoice_no: "INV-0003",
              tenancy: "TEN-003",
              status: "Overdue",
              p_status: "Posted",
              bill_to: "Mike Johnson",
              date: "11/15/2024",
              due_date: "12/15/2024",
              amount: "1,800.00",
              property: "Sunset Towers",
            },
            {
              invoice_no: "INV-0004",
              tenancy: "TEN-004",
              status: "Paid",
              p_status: "Posted",
              bill_to: "Sarah Wilson",
              date: "12/10/2024",
              due_date: "12/25/2024",
              amount: "950.00",
              property: "Riverside Condos",
            },
            {
              invoice_no: "INV-0005",
              tenancy: "TEN-005",
              status: "Pending",
              p_status: "Draft",
              bill_to: "David Brown",
              date: "12/18/2024",
              due_date: "01/18/2025",
              amount: "3,100.00",
              property: "Ocean View Residences",
            },
          ]}
          isPending={false}
          pagination={pagination}
          setPagination={setPagination}
          rowKey={(item: invoice) => item.invoice_no}
          isFilter={isFilter}
        />
      </div>
      {/* <MapWithPoints /> */}
    </div>
  );
};

export default InvoiceTap;
