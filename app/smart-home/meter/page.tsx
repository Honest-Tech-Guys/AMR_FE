"use client";
import { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Wifi,
  Power,
  TrendingUp,
  Zap,
  Activity,
  RefreshCw,
  Download,
  Settings,
  CirclePoundSterling,
  BrushCleaning,
  ChartLine,
  QrCode,
} from "lucide-react";
import useGetMetersList from "@/lib/services/hooks/useGetMeterList";
import {
  Pagination,
  PaginationContent,
  PaginationControl,
  PaginationData,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ResponsiveFilter } from "@/components/responsive-filter";
import { Button } from "@/components/ui/button";
import CreateMeter from "./CreateMeter";
import EditMeter from "./EditMeter";
import MeterType from "@/types/MeterType";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useGetDeviceStatus from "@/lib/services/hooks/SyncMeter";
import { cn } from "@/lib/utils";
import useClearEnergy from "@/lib/services/hooks/CleanMeterBalance";
import useToggleDevice from "@/lib/services/hooks/toogleMeter";
import TopUpDialog from "@/components/TopUpMeter";
export default function ModernMeterManagement() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [openView, setOpenView] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MeterType>();
  const [selectedItemSync, setSelectedItemSync] = useState<MeterType>();
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
    meter_serial: "",
    status: "",
    page: "1",
    per_page: "10",
  });
  const [appliedFilters, setAppliedFilters] = useState({});
  const { data, isLoading, isPending } = useGetMetersList(appliedFilters);
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
      label: "Total Meters",
      value: "156",
      icon: Zap,
      color: "bg-green-50",
    },
    {
      label: "Active",
      value: "142",
      icon: Power,
      color: "bg-green-50",
    },
    {
      label: "Total Usage",
      value: "12.4K kWh",
      icon: Activity,
      color: "bg-green-50",
    },
    {
      label: "Total Balance",
      value: "85%",
      icon: TrendingUp,
      color: "bg-green-50",
    },
  ];
  const { refetch: refetchSync, isLoading: SyncLoading } = useGetDeviceStatus(
    selectedItemSync?.id
  );
  const { mutate: clearEnergy, isPending: clearLoading } = useClearEnergy();
  const { mutate: toggleDevice, isPending: toggleLoading } = useToggleDevice();
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<number | null>(null);
  return (
    <div className="min-h-screen  p-3">
      {/* Header Section */}
      <div className="mb-6 mt-3">
        {/* Stats Cards */}
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
        <div className=" my-3 bg-white p-5 rounded-2xl shadow-lg">
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
                name: "meter_serial",
                placeholder: "Meter Serial",
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
          {/* Actions */}
          <div className="flex w-full justify-between ">
            <div>
              {" "}
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
              <CreateMeter />
            </div>
          </div>
        </div>
      </div>

      {/* Meter Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.data.map((meter) => {
          function calculateEfficiency(meter: MeterType): number {
            const used = parseFloat(meter.used_unit) || 0;
            const balance = parseFloat(meter.balance_unit) || 0;

            const total = used + balance;

            if (total === 0) return 0;

            return Number(((used / total) * 100).toFixed(2));
          }

          const efficiency = calculateEfficiency(meter);

          return (
            <div
              key={meter.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 overflow-hidden group"
              onMouseEnter={() => setHoveredCard(meter.id as never)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-[#076633] to-[#076633]/70 p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>
                <div className="flex items-start justify-between relative z-10">
                  <div>
                    <h3
                      className="text-xl font-bold text-white mb-1 cursor-pointer"
                      onClick={() => {
                        setOpenView(true);
                        setSelectedItem(meter);
                      }}
                    >
                      {meter.name}
                    </h3>
                    <p className="text-slate-300 text-sm">
                      {"unit" in meter.meterable
                        ? `${meter.meterable?.unit.property.property_name} ${meter.meterable?.unit.block_floor_unit_number} ${meter.meterable?.name}`
                        : `${meter.meterable?.property?.property_name} ${meter.meterable?.block_floor_unit_number}`}
                    </p>
                  </div>
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-all">
                    {" "}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <MoreVertical className="w-5 h-5 text-white cursor-pointer" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56" align="start">
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            className="flex gap-2"
                            onSelect={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (meter.id === selectedItemSync?.id) {
                                refetchSync();
                              } else {
                                setSelectedItemSync(meter);
                              }
                            }}
                            disabled={SyncLoading}
                          >
                            <RefreshCw
                              className={cn(SyncLoading ? "animate-spin" : "")}
                            />
                            <span>Sync</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="flex gap-2"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setSelectedDevice(meter.id);
                              setTopUpOpen(true);
                            }}
                          >
                            <CirclePoundSterling />
                            <span>Top Up</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="flex gap-2"
                            onSelect={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              clearEnergy(meter.id);
                            }}
                            disabled={clearLoading}
                          >
                            <BrushCleaning />
                            <span>Clean Balance</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="flex gap-2"
                            disabled={toggleLoading}
                            onSelect={(e) => {
                              e.preventDefault(); // يمنع الإغلاق
                              e.stopPropagation(); // يمنع Bubbling
                              toggleDevice(meter.id);
                            }}
                          >
                            <Power
                              className={toggleLoading ? "animate-spin" : ""}
                            />

                            <span>
                              {meter.power_status === "on"
                                ? "Disconnect"
                                : "Connect"}
                            </span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex gap-2">
                            <ChartLine />
                            <span>Meter Usage</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex gap-2">
                            <QrCode />
                            <span>Download QR</span>
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5">
                {/* Status Badges */}
                <div className="flex gap-2 mb-4">
                  {meter.connection_status === "online" ? (
                    <span className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold border border-green-200">
                      <Wifi className="w-3 h-3" />
                      Connected
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-semibold border border-red-200">
                      <Wifi className="w-3 h-3" />
                      Disconnected
                    </span>
                  )}
                  {meter.power_status === "on" ? (
                    <span className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold border border-blue-200">
                      <Power className="w-3 h-3" />
                      Active
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-semibold border border-red-200">
                      <Power className="w-3 h-3" />
                      Inactive
                    </span>
                  )}
                </div>

                {/* Metrics */}
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-600 text-sm font-medium">
                      Used Units
                    </span>
                    <span className="text-slate-800 font-bold">
                      {meter.used_unit} kWh
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-xl">
                    <span className="text-slate-600 text-sm font-medium">
                      Balance
                    </span>
                    <span className="text-green-700 font-bold">
                      {meter.balance_unit} kWh
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl">
                    <span className="text-slate-600 text-sm font-medium">
                      Unit Price
                    </span>
                    <span className="text-blue-700 font-bold">
                      RM {meter.unit_price_per_unit}
                    </span>
                  </div>
                </div>

                {/* Efficiency Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-600 text-sm font-medium">
                      Efficiency
                    </span>
                    <span className="text-slate-800 font-bold">
                      {efficiency}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        efficiency > 85
                          ? "bg-gradient-to-r from-green-500 to-green-600"
                          : efficiency > 70
                          ? "bg-gradient-to-r from-yellow-500 to-yellow-600"
                          : "bg-gradient-to-r from-red-500 to-red-600"
                      }`}
                      style={{ width: `${efficiency}%` }}
                    ></div>
                  </div>
                </div>

                {/* Owner/Tenant Info */}
                <div className="border-t border-slate-200 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Owner:</span>
                    <span className="text-slate-800 font-medium">
                      {"unit" in meter.meterable
                        ? `${meter.meterable?.unit.property?.owner?.name} `
                        : `${meter.meterable?.property?.owner?.name} `}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Tenant:</span>
                    <span className="text-slate-800 font-medium">
                      {meter?.tenant_name}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                {/* <div className="grid grid-cols-3 gap-2 mt-4">
                  <button className="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex items-center justify-center group">
                    <Activity className="w-4 h-4 text-slate-700 group-hover:scale-110 transition-transform" />
                  </button>
                  <button className="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex items-center justify-center group">
                    <Download className="w-4 h-4 text-slate-700 group-hover:scale-110 transition-transform" />
                  </button>
                  <button className="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex items-center justify-center group">
                    <Settings className="w-4 h-4 text-slate-700 group-hover:scale-110 transition-transform" />
                  </button>
                </div> */}
              </div>
            </div>
          );
        })}
      </div>
      {selectedItem && (
        <EditMeter
          meter={selectedItem}
          onOpenChange={setOpenView}
          open={openView}
        />
      )}
      <TopUpDialog
        open={topUpOpen}
        onOpenChange={setTopUpOpen}
        deviceId={selectedDevice}
      />
    </div>
  );
}
