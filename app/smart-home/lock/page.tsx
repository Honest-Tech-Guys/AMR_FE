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
  return (
    <div>
      <div className="w-full  p-3 ">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
            <div
              key={lock.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 overflow-hidden group"
              // onMouseEnter={() => setHoveredCard(lock.id)}
              // onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-primary to-primary/70 p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>
                <div className="flex items-start justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                      {/* {lock?.status === "locked" ? (
                        <Lock className="w-6 h-6 text-white" />
                      ) : (
                        <Unlock className="w-6 h-6 text-white" />
                      )} */}
                    </div>
                    <div>
                      <h3
                        className="text-lg font-bold text-white"
                        onClick={() => {
                          setOpenView(true);
                          setSelectedItem(lock);
                        }}
                      >
                        {lock.serial_number}
                      </h3>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-all">
                    <MoreVertical className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5">
                {/* Status Indicators */}
                <div className="flex gap-2 mb-4 flex-wrap">
                  {/* {lock?.connection === "online" ? (
                    <span className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold border border-green-200">
                      <Signal className="w-3 h-3" />
                      Online
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-semibold border border-red-200">
                      <Signal className="w-3 h-3" />
                      Offline
                    </span>
                  )} */}
                  {/* {lock?.status === "locked" ? (
                    <span className="flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold border border-indigo-200">
                      <Lock className="w-3 h-3" />
                      Locked
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-semibold border border-orange-200">
                      <Unlock className="w-3 h-3" />
                      Unlocked
                    </span>
                  )} */}

                  {/* <div
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getBatteryColor(
                      lock?.battery
                    )}`}
                  >
                    <Battery className="w-3 h-3" />
                    {lock?.battery}%
                  </div> */}
                  <span className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-semibold border ">
                    <Users className="w-3 h-3" />
                    10
                  </span>
                </div>

                {/* Battery Status */}

                {/* Property Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Home className="w-4 h-4 text-slate-600" />
                      <span className="text-slate-600 text-sm font-medium">
                        Property
                      </span>
                    </div>
                    <span className="text-slate-800 font-semibold text-sm">
                      {"unit" in lock.lockable
                        ? `${lock.lockable?.unit.property.property_name} `
                        : `${lock.lockable?.property?.property_name} `}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <p className="text-slate-500 text-xs mb-1">Unit</p>
                      <span className="text-slate-800 font-semibold text-sm">
                        {"unit" in lock.lockable
                          ? ` ${lock.lockable?.unit.block_floor_unit_number} `
                          : `${lock.lockable?.block_floor_unit_number}`}
                      </span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <p className="text-slate-500 text-xs mb-1">Room</p>
                      <span className="text-slate-800 font-semibold text-sm">
                        {"unit" in lock.lockable
                          ? ` ${lock.lockable?.name}`
                          : `-`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Owner/Tenant Info */}
                <div className="border-t border-slate-200 pt-4 space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Owner:</span>
                    <span className="text-slate-800 font-medium">
                      {"unit" in lock.lockable
                        ? ` ${lock.lockable?.unit?.property?.owner?.name} `
                        : `${lock.lockable?.property?.owner?.name}`}
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
