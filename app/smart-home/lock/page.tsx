"use client";

import { InputWithIcon } from "@/components/InpuWithIcon";
import { ResponsiveFilter } from "@/components/responsive-filter";
import { Button } from "@/components/ui/button";
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Lock,
  Unlock,
  Battery,
  Wifi,
  User,
  Users,
  Home,
  Shield,
  Activity,
  RefreshCw,
  Key,
  DoorOpen,
  Signal,
  Clock,
} from "lucide-react";
import { useEffect, useState } from "react";

import useGetLocksList from "@/lib/services/hooks/useGetLockList";
import CreateLock from "./CreateLock";
import EditLock from "./EditLock";
import {
  Pagination,
  PaginationContent,
  PaginationControl,
  PaginationData,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import LockType from "@/types/LockType";
import { cn } from "@/lib/utils";
const Page = () => {
  const [openView, setOpenView] = useState(false);
  const [selectedItem, setSelectedItem] = useState<LockType>();

  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    per_page: 10,
    last_page: 1,
    links: [],
  });
  const [formFilters, setFormFilters] = useState({
    property_name: "",
    owner_name: "",
    tenant_name: "",
    lock_serial: "",
    status: "",
    page: "1",
    per_page: "10",
  });
  const [appliedFilters, setAppliedFilters] = useState({});
  const { data, isLoading, isPending } = useGetLocksList(appliedFilters);
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
  const stats = [
    {
      label: "Total Locks",
      value: "248",
      icon: Lock,
      color: "bg-green-50",
    },
    {
      label: "Active",
      value: "235",
      icon: Shield,
      color: "bg-green-50",
    },
    {
      label: "Low Battery",
      value: "12",
      icon: Battery,
      color: "bg-green-50",
    },
    {
      label: "Total Users",
      value: "1,247",
      icon: Users,
      color: "bg-green-50",
    },
  ];
  const getBatteryColor = (battery: number) => {
    if (battery > 70) return "text-green-600 bg-green-50 border-green-200";
    if (battery > 30) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getBatteryIcon = (battery: number) => {
    if (battery > 70) return "bg-gradient-to-r from-green-500 to-green-600";
    if (battery > 30) return "bg-gradient-to-r from-yellow-500 to-yellow-600";
    return "bg-gradient-to-r from-red-500 to-red-600";
  };

  const getBatteryGradient = (battery: number) => {
    if (battery > 70) return "from-green-500 to-green-600";
    if (battery > 30) return "from-yellow-500 to-yellow-600";
    return "from-red-500 to-red-600";
  };
  return (
    <div>
      <div className="w-full  p-3 ">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 mt-3">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 hover:scale-105 hover:border-green-600"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-xs font-medium mb-1">
                    {stat.label}
                  </p>
                  <p className="text-xl font-bold text-slate-800">
                    {stat.value}
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
        <div className=" mt-3 mb-6 bg-white p-5 rounded-2xl shadow-sm">
          <ResponsiveFilter
            filters={[
              {
                name: "property_name",
                placeholder: "Property Name",
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
                name: "tenant_name",
                placeholder: "Tenant Name",
                type: "input",
                icon: Search,
              },
              {
                name: "lock_serial",
                placeholder: "Lock Serial",
                type: "input",
                icon: Search,
              },
              {
                name: "status",
                placeholder: "Status",
                type: "select",
                selectItems: [
                  { label: "ON", value: "on" },
                  { label: "OFF", value: "off" },
                ],
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
          <div className="flex w-full justify-between ">
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
              <CreateLock />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 ">
          {data?.data?.map((lock) => (
            // <div
            //   key={lock.id}
            //   className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 overflow-hidden group"
            //   // onMouseEnter={() => setHoveredCard(lock.id)}
            //   // onMouseLeave={() => setHoveredCard(null)}
            // >
            //   {/* Card Header */}
            //   <div className="bg-gradient-to-r from-primary to-primary/70 p-5 relative overflow-hidden">
            //     <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>
            //     <div className="flex items-start justify-between relative z-10">
            //       <div className="flex items-center gap-3">
            //         <div>
            //           <h3
            //             className="text-lg font-bold text-white"
            //             onClick={() => {
            //               setOpenView(true);
            //               setSelectedItem(lock);
            //             }}
            //           >
            //             {lock.serial_number}
            //           </h3>
            //           <p className="text-slate-300 text-sm">
            //             {"unit" in lock.lockable
            //               ? `${lock.lockable?.unit.property.property_name} ${lock.lockable?.unit.block_floor_unit_number} ${lock.lockable?.name}`
            //               : `${lock.lockable?.property?.property_name} ${lock.lockable?.block_floor_unit_number}`}
            //           </p>
            //         </div>
            //       </div>
            //       <button className="p-2 hover:bg-white/10 rounded-lg transition-all">
            //         <MoreVertical className="w-5 h-5 text-white" />
            //       </button>
            //     </div>
            //   </div>

            //   {/* Card Body */}
            //   <div className="p-5">
            //     {/* Status Indicators */}
            //     <div className="flex gap-2 mb-4 flex-wrap">
            //       {lock?.connection === "online" ? (
            //         <span className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold border border-green-200">
            //           <Signal className="w-3 h-3" />
            //           Online
            //         </span>
            //       ) : (
            //         <span className="flex items-center gap-1 px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-semibold border border-red-200">
            //           <Signal className="w-3 h-3" />
            //           Offline
            //         </span>
            //       )}
            //       {lock?.status === "locked" ? (
            //         <span className="flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold border border-indigo-200">
            //           <Lock className="w-3 h-3" />
            //           Locked
            //         </span>
            //       ) : (
            //         <span className="flex items-center gap-1 px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-semibold border border-orange-200">
            //           <Unlock className="w-3 h-3" />
            //           Unlocked
            //         </span>
            //       )}

            //       <div
            //         className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getBatteryColor(
            //           lock?.battery
            //         )}`}
            //       >
            //         <Battery className="w-3 h-3" />
            //         {lock?.battery}%
            //       </div>
            //       <span className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-semibold border ">
            //         <Users className="w-3 h-3" />
            //         10
            //       </span>
            //     </div>
            //     <div className="border-t border-slate-200 pt-4 space-y-2 mb-4">
            //       <div className="flex justify-between text-sm">
            //         <span className="text-slate-500">Owner:</span>
            //         <span className="text-slate-800 font-medium">
            //           {"unit" in lock.lockable
            //             ? ` ${lock.lockable?.unit?.property?.owner?.name} `
            //             : `${lock.lockable?.property?.owner?.name}`}
            //         </span>
            //       </div>
            //       <div className="flex justify-between text-sm">
            //         <span className="text-slate-500">Tenant:</span>
            //         <span className="text-slate-800 font-medium">
            //           {lock?.tenant_name}
            //         </span>
            //       </div>
            //     </div>
            //   </div>
            // </div>
            <div
              key={lock.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 overflow-hidden group"
            >
              {/* Card Header - Keep Original Style */}
              <div className="bg-gradient-to-r from-primary to-primary/70 p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>
                <div className="flex items-start justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <div>
                      <h3
                        className="text-lg font-bold text-white cursor-pointer hover:text-indigo-100 transition-colors"
                        onClick={() => {
                          setOpenView(true);
                          setSelectedItem(lock);
                        }}
                      >
                        {lock.serial_number}
                      </h3>
                      <p className="text-indigo-100 text-sm mt-1">
                        {"unit" in lock.lockable
                          ? `${lock.lockable?.unit.property.property_name} ${lock.lockable?.unit.block_floor_unit_number} ${lock.lockable?.name}`
                          : `${lock.lockable?.property?.property_name} ${lock.lockable?.block_floor_unit_number}`}
                      </p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-all">
                    <MoreVertical className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Enhanced Card Body */}
              <div className="p-6">
                {/* Status Badges Row */}
                <div className="flex gap-2 mb-5 flex-wrap">
                  {lock?.status === "online" ? (
                    <span className="flex items-center gap-1.5 px-3 py-2 bg-green-50 text-green-700 rounded-lg text-xs font-semibold border border-green-200">
                      <Signal className="w-4 h-4" />
                      Online
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-700 rounded-lg text-xs font-semibold border border-red-200">
                      <Signal className="w-4 h-4" />
                      Offline
                    </span>
                  )}
                  <div
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getBatteryColor(
                      lock?.battery
                    )}`}
                  >
                    <Battery className="w-3 h-3" />
                    {lock?.battery}%
                  </div>
                </div>
                {/* Authorized Users - Featured Box */}
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-600 text-sm font-medium">
                      Authorized Users
                    </span>
                    <span className="text-slate-800 font-bold">{10}</span>
                  </div>
                  <div
                    className={cn(
                      "flex justify-between items-center p-3  rounded-xl",
                      lock.has_gateway === 0 ? "bg-red-50" : "bg-green-50"
                    )}
                  >
                    <span className="text-slate-600 text-sm font-medium">
                      Gateway
                    </span>
                    {lock.has_gateway === 0 ? (
                      <span className="text-red-700 font-bold">No</span>
                    ) : (
                      <span className="text-green-700 font-bold">Yes</span>
                    )}
                  </div>
                </div>
                <div className="border-t border-slate-200 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Owner:</span>
                    <span className="text-slate-800 font-medium">
                      {"unit" in lock.lockable
                        ? `${lock.lockable?.unit.property?.owner?.name} `
                        : `${lock.lockable?.property?.owner?.name} `}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Tenant:</span>
                    <span className="text-slate-800 font-medium">
                      {lock?.tenant_name}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedItem && (
        <EditLock
          lock={selectedItem}
          onOpenChange={setOpenView}
          open={openView}
        />
      )}
    </div>
  );
};

export default Page;
