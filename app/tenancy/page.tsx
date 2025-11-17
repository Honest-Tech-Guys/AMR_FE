"use client";
import HeaderPage from "@/components/HeaderPage";

import { InputWithIcon } from "@/components/InpuWithIcon";
import { ResponsiveFilter } from "@/components/responsive-filter";
import { Button } from "@/components/ui/button";
import { Calendar, Search } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
// import CreateNewOwner from "./CreateNewOwner";
import useGetOwnersList from "@/lib/services/hooks/useGetOwners";
import OwnerType from "@/types/OwnerType";
import { Separator } from "@/components/ui/separator";
import ViewTenancy from "./ViewTenancy";
import useGetTenancyList from "@/lib/services/hooks/useGetTenancyList";
import {
  Pagination,
  PaginationContent,
  PaginationControl,
  PaginationData,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Unit } from "@/types/UnitType";
import { Room } from "@/types/RoomType";
import CreateNewTenancy from "./CreateNewTenancy";
import { useSearchParams } from "next/navigation";

const Page = () => {
  const actionButton = (
    <Button key="search" className="rounded-[6px]">
      <Search className="size-4 text-white" strokeWidth={2.5} />
    </Button>
  );
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    per_page: 10,
    last_page: 1,
    links: [],
  });
  const [formFilters, setFormFilters] = useState({
    property_name: "",
    tenant_name: "",
    owner_name: "",
    status: "",
    data_range: "",
    te: "",
    page: "1",
    per_page: "10",
  });
  const searchParams = useSearchParams();
  const query = Object.fromEntries(searchParams.entries());
  console.log(query);
  const [appliedFilters, setAppliedFilters] = useState({});
  const { data, isLoading, isPending, error } =
    useGetTenancyList(appliedFilters);
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
    setFormFilters({ ...formFilters, te: query.te, status: query.status });
    setAppliedFilters({
      ...formFilters,
      te: query.te,
      status: query.status,
      page: pagination.page.toString(),
      per_page: pagination.per_page.toString(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, pagination.per_page, query.te, query.status]);
  function getStatusColor(status: string): string {
    switch (status) {
      case "Upcoming":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "Expiring Soon":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-300";
      case "Active":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  }
  return (
    <div>
      {/* <HeaderPage title="Tenancy" /> */}
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
              name: "tenant_name",
              placeholder: "Tenant Name",
              type: "input",
              icon: Search,
            },
            {
              name: "owner_name",
              placeholder: "Owner Name",
              type: "input",
              icon: Search,
            },
            {
              name: "status",
              placeholder: "Status",
              type: "select",
              selectItems: [
                { label: "Active", value: "Active" },
                { label: "Inactive", value: "Inactive" },
                { label: "Expiring Soon", value: "Expiring Soon" },
                { label: "Last Month", value: "Last Month" },
                { label: "Upcoming", value: "Upcoming" },
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
        {/* Actions */}
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
            <CreateNewTenancy />
          </div>
        </div>
        {/*
         */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="text-gray-500">Loading tenancy...</div>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <div className="text-red-500">Error loading tenancy.</div>
          </div>
        )}
        {
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.data.map((tenancy) => (
              <div
                key={tenancy.id}
                className="border rounded-2xl p-4 hover:shadow-md transition-shadow"
              >
                {/* <label className="font-bold text-[#337AB7] text-lg">
                  {tenancy.name}
                </label> */}
                <p className="flex items-center gap-2">
                  <Badge className={getStatusColor(tenancy.status)}>
                    {tenancy.status}
                  </Badge>
                  <Badge className="bg-gray-100 text-black font-normal  border-1">
                    Auto Pay Not Activated
                  </Badge>
                </p>
                <p className="text-sm text-gray-600">
                  <p className="font-medium">Tenant</p>{" "}
                  <span className="font-bold text-lg">
                    {tenancy.tenant.name}
                  </span>
                </p>
                <div className="mt-3 space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Type:</span>{" "}
                    {tenancy.tenantable
                      ? "unit" in tenancy.tenantable
                        ? "Room Rental"
                        : (tenancy.tenantable as Unit).rental_type
                      : "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Property:</span>{" "}
                    {tenancy.tenantable ? (
                      "unit" in tenancy.tenantable ? (
                        // tenantable is a Room
                        <>
                          {tenancy.tenantable.unit?.property?.property_name}{" "}
                          {"\\"}
                          {
                            tenancy.tenantable.unit?.block_floor_unit_number
                          }{" "}
                          {tenancy.tenantable.name
                            ? `\\${tenancy.tenantable.name}`
                            : ""}
                        </>
                      ) : (
                        // tenantable is a Unit
                        <>
                          {tenancy.tenantable.property?.property_name} {"\\"}
                          {tenancy.tenantable.block_floor_unit_number}
                        </>
                      )
                    ) : (
                      "N/A"
                    )}
                  </p>

                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Tenancy:</span> {tenancy.code}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Rental:</span> MRY
                    {" " + tenancy.rental_fee}
                  </p>
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-600">
                      <p className="font-medium">Tenancy Start Date</p>{" "}
                      {tenancy.tenancy_period_start_date}
                    </p>
                    <p className="text-sm text-gray-600 max-w-29">
                      <p className="font-medium">Tenancy End Date</p>{" "}
                      {tenancy.tenancy_period_end_date}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className=" flex  flex-col gap-2">
                      <p className="text-sm text-gray-600">
                        <p className="font-medium">Owner</p>{" "}
                        {(tenancy?.tenantable as Unit)?.property?.owner?.name ??
                          ""}
                        {(tenancy?.tenantable as Room)?.unit?.property?.owner
                          ?.name ?? ""}
                      </p>
                      <p className="text-sm text-gray-600">
                        <p className="font-medium">Smart Meter</p>{" "}
                        {tenancy.meters ? "" : "no smart meter"}
                      </p>
                    </div>
                    <div>
                      {" "}
                      <p className="text-sm text-gray-600 max-w-28">
                        <p className="font-medium ">Top Up</p>
                        {/* {tenancy.top_up} */}
                      </p>
                    </div>
                  </div>
                </div>
                <Separator className="my-5" />
                <div className="flex justify-center text-sm font-normal text-primary">
                  <ViewTenancy tenancy={tenancy} />
                </div>
              </div>
            ))}
          </div>
        }

        {/* {!isLoading && !error && (!data || data.length === 0) && (
          <div className="text-center py-8">
            <div className="text-gray-500">No owners found.</div>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default Page;
