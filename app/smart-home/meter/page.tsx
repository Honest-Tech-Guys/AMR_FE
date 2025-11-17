"use client";
import HeaderPage from "@/components/HeaderPage";
import { InputWithIcon } from "@/components/InpuWithIcon";
import { ResponsiveFilter } from "@/components/responsive-filter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BrushCleaning,
  Calendar,
  ChartLine,
  ChevronDown,
  CirclePoundSterling,
  Power,
  QrCode,
  RefreshCw,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import CreateMeter from "./CreateMeter";
import useGetMetersList from "@/lib/services/hooks/useGetMeterList";
import EditMeter from "./EditMeter";
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
  const [isFilter, setIsFilter] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Meter>();
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    per_page: 10,
    last_page: 1,
    links: [],
  });
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
    console.log(pagination.per_page);
    setAppliedFilters({
      ...formFilters,
      page: pagination.page.toString(),
      per_page: pagination.per_page.toString(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, pagination.per_page]);

  if (isLoading) {
    return <p>Loading...</p>;
  }
  return (
    <div>
      {/* <HeaderPage title="Meter" /> */}
      <div className="w-full mt-5 mb-10 rounded-[6px] p-3 bg-white">
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
                { label: "whole unit", value: "Whole Unit" },
                { label: "Room Rental", value: "Room Rental" },
              ],
              icon: Search,
            },
            {
              name: "Meter_and_lock",
              placeholder: "Meter and Lock",
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {data?.data.map((meter) => (
            <div key={meter.id} className="border rounded-2xl p-3">
              {/* Title */}
              <label
                className="font-bold text-[#337AB7] cursor-pointer"
                onClick={() => {
                  setOpenView(true);
                  setSelectedItem(meter);
                }}
              >
                {meter.name}
              </label>

              <div>
                {/* Action Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="font-thin text-[#337AB7] border-0 shadow-none hover:bg-transparent cursor-pointer"
                    >
                      Action <ChevronDown className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="start">
                    <DropdownMenuGroup>
                      <DropdownMenuItem className="flex gap-2">
                        <RefreshCw />
                        <span>Sync</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex gap-2">
                        <CirclePoundSterling />
                        <span>Top Up</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex gap-2">
                        <BrushCleaning />
                        <span>Clean Balance</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex gap-2">
                        <Power />
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

                {/* Info Section */}
                <div className="space-y-1 mt-2">
                  <p>
                    <span className="font-medium">Used Unit:</span>{" "}
                    {meter.used_unit}
                  </p>
                  <p>
                    <span className="font-medium">Balance Unit:</span>{" "}
                    {meter.balance_unit}
                  </p>
                  <p>
                    <span className="font-medium">Unit Price:</span> RM{" "}
                    {meter.unit_price_per_unit}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span>{" "}
                    {meter.connection_status}
                  </p>
                  <p>
                    <span className="font-medium">Property:</span>{" "}
                    {meter.meterable?.property_name}
                  </p>
                </div>

                {/* Badges */}
                <div className="flex gap-3 mt-3 flex-wrap">
                  {meter.connection_status === "online" && (
                    <Badge className="bg-[#F6FFED] text-[#52C41A] rounded-[6px] border-[#B7EB8F]">
                      Wifi Connected
                    </Badge>
                  )}
                  {meter.power_status === "on" && (
                    <Badge className="bg-[#E6F7FF] text-[#1890FF] rounded-[6px] border-[#91D5FF]">
                      Power On
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedItem && (
        <EditMeter
          meter={selectedItem}
          onOpenChange={setOpenView}
          open={openView}
        />
      )}
    </div>
  );
};

export default Page;
