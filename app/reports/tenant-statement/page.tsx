"use client";

import HeaderPage from "@/components/HeaderPage";
import { Calendar, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResponsiveFilter } from "@/components/responsive-filter";
import Datatable, { Column } from "@/components/datatable";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { TenantStatementReport } from "@/types/TenetStatementReport";
import useGetTenantStatementReport from "@/lib/services/hooks/useGetTenantStatementReport";
import { createAuthenticatedFetch } from "@/app/tenancy/Tabs/Documents";
import { formatDate } from "@/lib/utils";

interface PaginationData {
  page: number;
  per_page: number;
}

const TenantStatementPage = () => {
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    per_page: 10,
  });

  const { data, isLoading, error } = useGetTenantStatementReport();

  const tenantColumns: Column<TenantStatementReport>[] = [
    { title: "Name", key: "name" },
    { title: "Email", key: "email" },
    { title: "Phone", key: "phone" },
    { title: "Invoices", key: "invoices_count" },
    { title: "Total Amount", key: "total_amount" },
    { title: "Paid", key: "total_paid" },
    { title: "Overdue", key: "total_overdue" },
    { title: "Balance", key: "balance" },
  ];

  const tableData = data?.data.map((item: TenantStatementReport) => ({
    id: item.id,
    name: item.name,
    email: item.email,
    phone: item.phone,
    invoices_count: item.invoices_count,
    total_amount: item.total_amount,
    total_paid: item.total_paid,
    total_overdue: item.total_overdue,
    balance: item.balance,
  }));

  const [formFilters, setFormFilters] = useState({
    name: "",
    email: "",
    phone: "",
    date_range: "",
    status: "all",
    page: "1",
    per_page: "10",
  });

  return (
    <div>
      <HeaderPage title="Tenant Statement Report" />
      <div className="w-full mt-5 rounded-[6px] p-3 bg-white">
        {/* Filters */}
        <ResponsiveFilter
          filters={[
            {
              name: "property_name",
              placeholder: "Tenant Name",
              type: "input",
              icon: Search,
            },
            {
              name: "unit_name",
              placeholder: "Email",
              type: "input",
              icon: Search,
            },
            {
              name: "rental_type",
              placeholder: "Phone",
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
            <Button className="text-white">
              <Search />
            </Button>
          }
          formFilters={formFilters}
          setFormFilters={setFormFilters as never}
        />

        <Separator className="my-3" />
        <Button
          className="text-white"
          onClick={
            async () => {
              const response = await createAuthenticatedFetch(
                "http://43.217.80.136:8015/api/reports/tenant-account-summary/export"
              );

              if (!response) {
                console.log("error");
                return;
              }

              // Create blob from response
              const blob = await response.blob();

              // Create download link
              const url = window.URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = `TenantStatement_${formatDate(Date.now())}.xlsx`;
              document.body.appendChild(link);
              link.click();

              // Cleanup
              document.body.removeChild(link);
              window.URL.revokeObjectURL(url);
            }
            // window.open(
            //   "http://43.217.80.136:8015/api/reports/tenant-account-summary/export",
            //   "_blank"
            // )
          }
        >
          Export
        </Button>
        {/* Desktop Table */}
        <div className="hidden md:block">
          <Datatable<TenantStatementReport>
            columns={tenantColumns}
            data={tableData ?? []}
            isPending={isLoading}
            pagination={pagination}
            setPagination={setPagination}
            rowKey={(item: TenantStatementReport) => item.id.toString()}
          />
        </div>

        {/* Mobile Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
          {tableData?.map((item: TenantStatementReport) => (
            <div
              key={item.id}
              className="border border-gray-200 rounded-lg p-4 shadow-sm bg-gray-50"
            >
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-primary">{item.name}</span>
              </div>
              <div className="text-xs text-gray-600 space-y-1">
                <p>
                  <span className="font-medium">Email:</span> {item.email}
                </p>
                <p>
                  <span className="font-medium">Phone:</span> {item.phone}
                </p>
                <p>
                  <span className="font-medium">Invoices:</span>{" "}
                  {item.invoices_count}
                </p>
                <p>
                  <span className="font-medium">Total:</span> RM{" "}
                  {item.total_amount}
                </p>
                <p>
                  <span className="font-medium">Paid:</span> RM{" "}
                  {item.total_paid}
                </p>
                <p>
                  <span className="font-medium">Overdue:</span>{" "}
                  <span className="text-red-600">RM {item.total_overdue}</span>
                </p>
                <p>
                  <span className="font-medium">Balance:</span>{" "}
                  <span className="text-green-700 font-semibold">
                    RM {item.balance}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div className="text-red-500 mt-2">Error loading statements.</div>
        )}
      </div>
    </div>
  );
};

// ✅ Add this line
export default TenantStatementPage;
