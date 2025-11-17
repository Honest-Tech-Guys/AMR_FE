"use client";
import HeaderPage from "@/components/HeaderPage";
import { InputWithIcon } from "@/components/InpuWithIcon";
import { Calendar, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResponsiveFilter } from "@/components/responsive-filter";
import Datatable, { Column } from "@/components/datatable";
import { useState } from "react";
import useGetInvoicesList from "@/lib/services/hooks/useGetInvoices";
import { Separator } from "@/components/ui/separator";
import CreateInvoice from "./CreateInvoice";
import { Invoice } from "@/types/InvoiceType";

interface PaginationData {
  page: number;
  per_page: number;
}

const Page = () => {
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    per_page: 10,
  });

  const { data, isLoading, error } = useGetInvoicesList();

  const invoiceColumns: Column<Invoice>[] = [
    { title: "Invoice", key: "invoice_number" },
    { title: "Tenancy", key: "tenancy" },
    { title: "Status", key: "status" },
    { title: "P Status", key: "p_status" },
    { title: "Bill To", key: "bill_to" },
    { title: "Date", key: "date" },
    { title: "Due Date", key: "due_date" },
    { title: "Amount", key: "amount" },
  ];

  const tableData = (data || []).map((item) => ({
    id: item.id,
    invoice_number: item.invoice_number,
    tenancy: item.tenancy?.code ?? "-",
    status: item.status,
    p_status: "Posted",
    bill_to: item.tenancy?.tenant?.name ?? "-",
    date: item.issue_date,
    due_date: item.due_date,
    amount: item.total_amount,
  }));

  const [formFilters, setFormFilters] = useState({
    property_name: "",
    unit_name: "",
    rental_type: "",
    Meter_and_lock: [],
    data_range: "",
    status: "all",
    page: "1",
    per_page: "10",
  });

  return (
    <div>
      {/* <HeaderPage title="Invoice" /> */}
      <div className="w-full mt-5 rounded-[6px] p-3 bg-white">
        {/* Responsive Filters */}
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
              placeholder: "Unit Number",
              type: "input",
              icon: Search,
            },
            {
              name: "rental_type",
              placeholder: "Rental Type",
              type: "select",
              selectItems: [
                { label: "Whole Unit", value: "Whole Unit" },
                { label: "Room Rental", value: "Room Rental" },
              ],
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
            <Button className="text-white">
              <Search />
            </Button>
          }
          formFilters={formFilters}
          setFormFilters={setFormFilters as never}
        />

        {/* Actions */}
        <div className="flex w-full justify-end my-3">
          <CreateInvoice />
        </div>

        <Separator />

        {/* Summary Cards */}
        <div className="grid w-full grid-cols-2 md:grid-cols-4 my-5 gap-4">
          {[
            { label: "Total Invoice", value: "RM 3,300 (3)" },
            { label: "Total Coming Due", value: "RM 2,100 (2)" },
            { label: "Total Overdue", value: "RM 1,200 (1)" },
            { label: "Total Paid", value: "RM 4,500 (5)" },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-gray-50 rounded-xl p-4 shadow-sm border hover:shadow-md transition-all"
            >
              <h2 className="text-xs text-gray-500">{stat.label}</h2>
              <h3 className="text-base font-semibold text-gray-800">
                {stat.value}
              </h3>
            </div>
          ))}
        </div>

        {/* 📱 Mobile Grid Cards / 💻 Desktop Table */}
        <div className="hidden md:block">
          <Datatable<Invoice>
            columns={invoiceColumns}
            data={tableData as never}
            isPending={isLoading}
            pagination={pagination}
            setPagination={setPagination}
            rowKey={(item: Invoice) => item.invoice_number}
          />
        </div>

        {/* Mobile Card Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
          {tableData.map((item) => (
            <div
              key={item.id}
              className="border border-gray-200 rounded-lg p-4 shadow-sm bg-gray-50"
            >
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-primary">
                  {item.invoice_number}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    item.status === "Paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {item.status}
                </span>
              </div>
              <div className="text-xs text-gray-600 space-y-1">
                <p>
                  <span className="font-medium">Tenant:</span> {item.bill_to}
                </p>
                <p>
                  <span className="font-medium">Date:</span> {item.date}
                </p>
                <p>
                  <span className="font-medium">Due:</span> {item.due_date}
                </p>
                <p>
                  <span className="font-medium">Amount:</span>{" "}
                  <span className="text-gray-800 font-semibold">
                    RM {item.amount}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div className="text-red-500 mt-2">Error loading invoices.</div>
        )}
      </div>
    </div>
  );
};

export default Page;
