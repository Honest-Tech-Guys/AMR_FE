"use client";
import HeaderPage from "@/components/HeaderPage";

import { InputWithIcon } from "@/components/InpuWithIcon";
import { ResponsiveFilter } from "@/components/responsive-filter";
import { Button } from "@/components/ui/button";
import { Calendar, Search } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import CreateNewTenant from "./CreateNewTenant";

import useGetTenantList from "@/lib/services/hooks/useGetTenantsList";
import EditTenant from "./EditTenant";
import { TenantType } from "@/types/TenantType";
import {
  Pagination,
  PaginationContent,
  PaginationControl,
  PaginationData,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const Page = () => {
  const [open, setOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<TenantType>();
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    per_page: 10,
    last_page: 1,
    links: [],
  });
  const [formFilters, setFormFilters] = useState({
    tenant_name: "",
    tenant_email: "",
    phone: "",
    type: "",
    identity_number: "",
    page: "1",
    per_page: "10",
  });
  const [appliedFilters, setAppliedFilters] = useState({});
  const { data, isLoading, isPending, error } =
    useGetTenantList(appliedFilters);
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
  return (
    <div>
      {/* <HeaderPage title="Tenant" /> */}
      <div className="w-full mt-5 rounded-[6px] p-3 bg-white">
        <ResponsiveFilter
          filters={[
            {
              name: "tenant_name",
              placeholder: "Tenant Name",
              type: "input",
              icon: Search,
            },
            {
              name: "tenant_email",
              placeholder: "Tenant Email",
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
              name: "type",
              placeholder: "Type",
              type: "select",
              selectItems: [
                { label: "Individual", value: "Individual" },
                { label: "Company", value: "Company" },
              ],
              icon: Search,
            },
            {
              name: "identity_number",
              placeholder: "Identity Number",
              type: "input",
              icon: Search,
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
        <div className="flex w-full justify-between my-3">
          <div>
            {!isPending && (
              <Pagination>
                <PaginationContent className="flex justify-between w-full">
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
            <CreateNewTenant />
          </div>
        </div>

        {isLoading && (
          <div className="text-center py-8">
            <div className="text-gray-500">Loading tenants...</div>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <div className="text-red-500">Error loading tenants.</div>
          </div>
        )}

        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.data.map((tenant) => (
              <div
                key={tenant.id}
                className="border rounded-2xl p-4 hover:shadow-md transition-shadow"
              >
                <label
                  className="font-bold text-[#337AB7] text-lg cursor-pointer"
                  onClick={() => {
                    setSelectedTenant(tenant);
                    setOpen(true);
                  }}
                >
                  {tenant.name}
                </label>
                <div className="mt-3 space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Entity:</span>{" "}
                    {tenant?.tenant_profile?.type}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Phone:</span>{" "}
                    {tenant?.tenant_profile?.alt_phone_number}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Email:</span> {tenant?.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Nationality:</span>{" "}
                    {tenant?.tenant_profile?.nationality}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Gender:</span>{" "}
                    {tenant?.tenant_profile?.gender}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Race:</span>{" "}
                    {tenant?.tenant_profile?.race}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Identity:</span>{" "}
                    {tenant?.tenant_profile?.type} -{" "}
                    {tenant?.tenant_profile?.identity_number}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Address:</span>{" "}
                    {tenant?.tenant_profile?.address_line_1},{" "}
                    {tenant?.tenant_profile?.city},{" "}
                    {tenant?.tenant_profile?.state}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Emergency Contact:</span>{" "}
                    {tenant?.tenant_profile?.emergency_name} (
                    {tenant?.tenant_profile?.emergency_relationship})
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Emergency Phone:</span>{" "}
                    {tenant?.tenant_profile?.emergency_phone}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">iCoins:</span> -
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-medium text-sm">Status:</span>
                    <Badge className="bg-[#F6FFED] text-[#52C41A] rounded-[6px] border-[#B7EB8F]">
                      Active
                    </Badge>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        <EditTenant
          tenant={selectedTenant as TenantType}
          isOpen={open}
          setIsOpen={setOpen}
        />

        {!isLoading && !error && (!data?.data || data.data.length === 0) && (
          <div className="text-center py-8">
            <div className="text-gray-500">No tenants found.</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
