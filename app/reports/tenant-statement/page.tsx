"use client";

import { createAuthenticatedFetch } from "@/app/tenancy/Tabs/Documents";
import Datatable, { Column } from "@/components/datatable";
import { ResponsiveFilter } from "@/components/responsive-filter";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationControl,
  PaginationData,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import useGetTenantStatementReport from "@/lib/services/hooks/useGetTenantStatementReport";
import { formatDate } from "@/lib/utils";
import { TenantStatementReport } from "@/types/TenetStatementReport";
import { Calendar, Search } from "lucide-react";
import { useEffect, useState } from "react";

const TenantStatementPage = () => {
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    per_page: 10,
    last_page: 1,
    links: [],
  });
  const [formFilters, setFormFilters] = useState({
    tenant_name: "",
    email: "",
    phone: "",
    date_range: "",
    page: "1",
    per_page: "10",
  });
  const [appliedFilters, setAppliedFilters] = useState({});
  const { data, isLoading, isPending, error } =
    useGetTenantStatementReport(appliedFilters);
  useEffect(() => {
    if (data) {
      setPagination((prev) => ({
        ...prev,
        page: data?.current_page ?? prev.page,
        per_page: data?.per_page ?? prev.per_page,
        last_page: data?.last_page ?? prev.last_page,
        links: data?.links ?? prev.links,
      }));
    }
  }, [data]);
  useEffect(() => {
    setAppliedFilters({
      ...formFilters,
      page: pagination.page.toString(),
      per_page: pagination.per_page.toString(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, pagination.per_page]);

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

  const tableData = data?.data?.map((item: TenantStatementReport) => ({
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

  return (
    <div>
      {/* <HeaderPage title="Tenant Statement Report" /> */}
      <div className="w-full mt-5 rounded-[6px] p-3 bg-white">
        {/* Filters */}
        <ResponsiveFilter
          filters={[
            {
              name: "tenant_name",
              placeholder: "Tenant Name",
              type: "input",
              icon: Search,
            },
            {
              name: "email",
              placeholder: "Email",
              type: "input",
              icon: Search,
            },
            {
              name: "phone",
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

        {/* <Separator className="my-3" /> */}
        <div className="flex w-full justify-between my-3">
          <div>
            {!isPending && (
              <Pagination>
                <PaginationContent className="flex justify-between w-full items-center">
                  <PaginationItem className="text-xs text-gray-600">
                    Page {pagination.page} of {pagination.last_page}
                  </PaginationItem>
                  <PaginationItem className="flex gap-x-2">
                    <PaginationControl
                      pagination={pagination}
                      setPagination={setPagination}
                    />
                    <PaginationPrevious
                      onClick={() => {
                        if (pagination.page <= 1) {
                          null;
                        } else {
                          setPagination((prev) => ({
                            ...prev,
                            page: prev.page - 1,
                          }));
                        }
                      }}
                      isActive={pagination.page > 1}
                      className={`bg-gray-100 cursor-pointer ${
                        pagination.page <= 1
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    />
                    <PaginationNext
                      onClick={() => {
                        if (
                          pagination.page >= (pagination.last_page as number)
                        ) {
                          null;
                        } else {
                          setPagination((prev) => ({
                            ...prev,
                            page: prev.page + 1,
                          }));
                        }
                      }}
                      isActive={pagination.page < (pagination.last_page ?? 1)}
                      className={`bg-gray-100 cursor-pointer ${
                        pagination.page >= (pagination.last_page as number)
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
          <div className="flex flex-wrap space-x-3">
            {/* <Button className="rounded-[6px] text-white ">
              Create New Expenses
            </Button> */}
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
                  link.download = `TenantStatement_${formatDate(
                    Date.now()
                  )}.xlsx`;
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
          </div>
        </div>

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
