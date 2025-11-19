"use client";
import HeaderPage from "@/components/HeaderPage";

import { InputWithIcon } from "@/components/InpuWithIcon";
import { ResponsiveFilter } from "@/components/responsive-filter";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle2,
  CreditCard,
  DollarSign,
  FileText,
  Home,
  LoaderCircle,
  Search,
  Timer,
  TrendingUp,
  User,
  Users,
  XCircle,
  Zap,
} from "lucide-react";
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
import { daysBetween } from "@/lib/utils";

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
        page: data?.tenancies.current_page ?? prev.page,
        per_page: data?.tenancies.per_page ?? prev.per_page,
        last_page: data?.tenancies.last_page ?? prev.last_page,
        links: data?.tenancies.links ?? prev.links,
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
  // const getPaymentStatusConfig = (status: any) => {
  //   const configs = {
  //     Paid: { color: "bg-green-50 border-green-200 text-green-700" },
  //     Pending: { color: "bg-orange-50 border-orange-200 text-orange-700" },
  //     Overdue: { color: "bg-red-50 border-red-200 text-red-700" },
  //     Upcoming: { color: "bg-blue-50 border-blue-200 text-blue-700" },
  //   };
  //   return configs[status] || configs["Upcoming"];
  // };
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
  const getStatusConfig = (
    status: "Active" | "Expiring Soon" | "Inactive" | "Upcoming"
  ) => {
    const configs = {
      Active: {
        color: "from-green-500 to-green-600",
        bgColor: "bg-green-50 border-green-200 text-green-700",
        icon: CheckCircle2,
      },
      "Expiring Soon": {
        color: "from-yellow-500 to-yellow-600",
        bgColor: "bg-yellow-50 border-yellow-200 text-yellow-700",
        icon: AlertCircle,
      },
      Inactive: {
        color: "from-gray-500 to-gray-600",
        bgColor: "bg-gray-50 border-gray-200 text-gray-700",
        icon: XCircle,
      },
      Upcoming: {
        color: "from-blue-500 to-blue-600",
        bgColor: "bg-blue-50 border-blue-200 text-blue-700",
        icon: Timer,
      },
    };
    return configs[status] || configs["Inactive"];
  };
  const stats = [
    {
      label: "Total Tenancies",
      value: data?.stats.total_tenancies,
      icon: FileText,
      color: "bg-green-50",
    },
    {
      label: "Active",
      value: data?.stats.active,
      icon: CheckCircle2,
      color: "bg-green-50",
    },
    {
      label: "Expiring Soon",
      value: data?.stats.expiry_soon,
      icon: AlertCircle,
      color: "bg-green-50",
    },
    {
      label: "Last Month",
      value: data?.stats.last_month,
      icon: TrendingUp,
      color: "bg-green-50",
    },
  ];
  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoaderCircle className="animate-spin text-primary w-10 h-10" />
      </div>
    );
  }
  return (
    <div className="w-full p-3 ">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 mt-3">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white hover:border-green-600 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-xs font-medium mb-1">
                  {stat.label}
                </p>
                <p className="text-xl font-bold text-slate-800">
                  {stat.value ?? 0}
                </p>
              </div>
              <div
                className={`bg-gradient-to-br ${stat.color} p-4 rounded-xl shadow-lg`}
              >
                <stat.icon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className=" my-3 bg-white p-5 rounded-2xl shadow-sm">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {data?.tenancies.data?.map((tenancy) => {
            const statusConfig = getStatusConfig(tenancy.status as never);
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={tenancy.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 overflow-hidden group"
                // onMouseEnter={() => setHoveredCard(tenancy.id as never)}
                // onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Card Header */}
                <div
                  className={`bg-gradient-to-r ${statusConfig.color} p-3 relative overflow-hidden`}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
                  {/* <div className="flex items-start justify-between relative z-10"> */}
                  <div>
                    <div className="w-full flex  justify-between ">
                      <div className="flex items-center gap-2 mb-2">
                        <StatusIcon className="w-5 h-5 text-white" />
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-semibold">
                          {tenancy.status}
                        </span>
                        <p className="text-white/90 text-sm">
                          {tenancy.tenantable
                            ? "unit" in tenancy.tenantable
                              ? ` ${tenancy?.tenantable?.unit?.rental_type} `
                              : `${tenancy?.tenantable?.rental_type}`
                            : "-"}
                        </p>
                      </div>
                      <div>
                        <div className=" flex gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg">
                          <p className=" text-white text-xs font-medium">
                            {daysBetween(
                              tenancy.tenancy_period_start_date,
                              tenancy.tenancy_period_end_date
                            )}{" "}
                          </p>
                          <p className=" text-white text-xs font-medium">
                            Days
                          </p>
                        </div>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">
                      {tenancy.code}
                    </h3>
                  </div>
                  {/* </div> */}
                </div>

                {/* Card Body */}
                <div className="p-3 ">
                  {/* Status Badges */}
                  {/* <div className="flex gap-2 mb-4 flex-wrap">
                    <span
                      className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${
                        getPaymentStatusConfig(tenancy.payment_status).color
                      }`}
                    >
                      <CreditCard className="w-3 h-3" />
                      {tenancy.payment_status}
                    </span>
                    {!tenancy.auto_pay && (
                      <span className="flex items-center gap-1 px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-xs font-medium border border-gray-200">
                        Auto Pay Off
                      </span>
                    )}
                    {tenancy.has_smart_meter && (
                      <span className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium border border-blue-200">
                        <Zap className="w-3 h-3" />
                        Smart Meter
                      </span>
                    )}
                  </div> */}

                  {/* Tenant Info */}
                  <div className="mb-3 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-50 text-green-600 p-3 rounded-xl">
                        <User className="w-5 h-5 " />
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 font-medium">
                          Tenant
                        </p>
                        <p className="text-lg font-bold text-slate-800">
                          {tenancy.tenant.name}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <Building2 className="w-4 h-4 text-slate-600 mt-0.5" />
                      <div className="flex-1 flex items-center gap-2">
                        <p className="text-xs text-slate-500 ">Property :</p>
                        <p className="text-sm font-semibold text-slate-800">
                          {tenancy.tenantable
                            ? "unit" in tenancy.tenantable
                              ? ` ${tenancy.tenantable?.unit?.property?.property_name} `
                              : `${tenancy.tenantable?.property?.property_name}`
                            : "-"}
                        </p>
                        <p className="text-xs text-slate-600 mt-1">
                          {tenancy.tenantable
                            ? "unit" in tenancy.tenantable
                              ? ` ${tenancy.tenantable?.unit?.block_floor_unit_number} `
                              : `${tenancy.tenantable?.block_floor_unit_number}`
                            : "-"}
                          {tenancy.tenantable
                            ? "unit" in tenancy.tenantable
                              ? `  ${tenancy.tenantable?.name}  `
                              : ``
                            : ""}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-green-50 rounded-xl border border-green-200">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-xs text-green-700 font-medium">
                            Monthly Rental
                          </p>
                        </div>
                        <p className="text-sm font-bold text-green-800">
                          RM {tenancy.rental_fee}
                        </p>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-xs text-blue-700 font-medium">
                            Type
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-blue-800">
                          {tenancy.rental_payment_frequency}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Tenancy Period */}
                  <div className="p-4 bg-slate-50 rounded-xl mb-4 border border-slate-200">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Calendar className="w-4 h-4 text-slate-600" />
                          <p className="text-xs text-slate-500 ">
                            Tenancy Start Date
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-slate-800 ml-6">
                          {tenancy.tenancy_period_start_date}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Calendar className="w-4 h-4 text-slate-600" />
                          <p className="text-xs text-slate-500 ">
                            Tenancy End Date
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-slate-800 ml-6">
                          {tenancy.tenancy_period_end_date}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Owner Info */}
                  <div className="border-t border-slate-200 pt-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-slate-600" />
                        <span className="text-xs text-slate-500 font-medium">
                          Owner:
                        </span>
                      </div>
                      <span className="text-sm text-slate-800 font-semibold">
                        {tenancy.tenantable
                          ? "unit" in tenancy.tenantable
                            ? ` ${tenancy.tenantable?.unit?.property?.owner?.name} `
                            : `${tenancy.tenantable?.property?.owner?.name}`
                          : ""}
                      </span>
                    </div>
                  </div>
                  {/* Action Button */}
                  <ViewTenancy tenancy={tenancy} />
                </div>
              </div>
            );
          })}
        </div>
      }

      {/* {!isLoading && !error && (!data || data.length === 0) && (
          <div className="text-center py-8">
            <div className="text-gray-500">No owners found.</div>
          </div>
        )} */}
    </div>
  );
};

export default Page;
