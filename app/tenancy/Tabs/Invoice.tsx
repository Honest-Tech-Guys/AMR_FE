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
import { useEffect, useState } from "react";
import useGetPropertiesList from "@/lib/services/hooks/useGetProperties";
import { Separator } from "@/components/ui/separator";
import { Tenancy } from "@/types/TenancyType";
import { formatDate } from "@/lib/utils";
import useGetSummaryInvoiceList from "@/lib/services/hooks/useGetSummaryInvoiceList";
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
  status: "Draft" | "Sent" | "Paid" | "Cancelled";
  p_status: "Draft" | "Sent" | "Paid" | "Cancelled";
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
interface Props {
  tenancy: Tenancy;
}
const InvoiceTap = ({ tenancy }: Props) => {
  const [isFilter, setIsFilter] = useState(false);
  const [actionIsOpen, setActionsIsOpen] = useState(false);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    per_page: 10,
  });
  const [invoices, setInvoices] = useState<invoice[]>([]);
  const { data } = useGetSummaryInvoiceList(tenancy.id);
  useEffect(() => {
    if (tenancy) {
      const transformedInvoices: invoice[] = tenancy.invoices.map(
        (invoice) => ({
          invoice_no: invoice.invoice_number,
          tenancy: tenancy.code,
          status: invoice.status,
          p_status: invoice.status,
          bill_to: tenancy.tenant.name,
          date: formatDate(invoice.created_at),
          due_date: formatDate(invoice.due_date),
          amount: invoice.total_amount,
          property: tenancy.full_property_name,
        })
      );

      setInvoices(transformedInvoices);
    }
  }, [tenancy]);
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
        <div className="md:max-w-[890px]">
          <Datatable<invoice>
            columns={invoiceColumns}
            data={invoices}
            isPending={false}
            pagination={pagination}
            setPagination={setPagination}
            rowKey={(item: invoice) => item.invoice_no}
            // isFilter={isFilter}
          />
        </div>
      </div>
      {/* <MapWithPoints /> */}
    </div>
  );
};

export default InvoiceTap;
